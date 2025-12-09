import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { relayService } from '../services/relay.service';
import { uploadService } from '../services/upload.service';
import { generationService } from '../services/generation.service';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Image as ImageIcon, Sparkles, X, Timer, ArrowRight, Check, Trash2 } from 'lucide-react';

const MAX_STEPS = 6;

const RelayPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [steps, setSteps] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [inputPreview, setInputPreview] = useState(null);
  const [inputMediaId, setInputMediaId] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [jobId, setJobId] = useState(null);
  const pollRef = useRef(null);

  const stepsCompleted = steps.filter((s) => s.status === 'completed').length;
  const hasReachedLimit = stepsCompleted >= MAX_STEPS || (session && session.status === 'closed');

  useEffect(() => {
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, []);

  const ensureSession = async () => {
    if (session) return session;
    const response = await relayService.createSession();
    setSession(response.data.data);
    return response.data.data;
  };

  const refreshSession = async (sessionId) => {
    if (!sessionId) return;
    try {
      const res = await relayService.getSession(sessionId);
      setSession(res.data.data.session);
      setSteps(res.data.data.steps || []);
      setDrafts(res.data.data.drafts || []);
    } catch (error) {
      console.error('Failed to load session', error);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Image too large, max 10MB');
      return;
    }

    setInputPreview(URL.createObjectURL(file));
    try {
      const uploadResult = await uploadService.uploadFile(file);
      setInputMediaId(uploadResult.mediaId || uploadResult.id);
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed, please retry');
      setInputPreview(null);
      setInputMediaId(null);
    }
  };

  const pollJob = (id, sessionId) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const statusRes = await generationService.getJobStatus(id);
        const job = statusRes.data.job || statusRes.data;
        if (job.status === 'completed') {
          clearInterval(pollRef.current);
          setJobId(null);
          setGenerating(false);
          setGeneratedImage(job.original_url || job.result_url);
          await refreshSession(sessionId);
        } else if (job.status === 'failed') {
          clearInterval(pollRef.current);
          setJobId(null);
          setGenerating(false);
          alert('Generation failed, please retry.');
        }
      } catch (error) {
        clearInterval(pollRef.current);
        setJobId(null);
        setGenerating(false);
        console.error('Polling failed', error);
      }
    }, 2000);
  };

  const handleGenerate = async () => {
    if (!user) {
      navigate('/register');
      return;
    }
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    if (hasReachedLimit) {
      alert('This relay is closed');
      return;
    }

    setGenerating(true);
    setGeneratedImage(null);
    try {
      const activeSession = await ensureSession();
      const payload = {
        prompt,
        title: title || undefined,
        description: description || undefined,
      };

      if (steps.length === 0 && inputMediaId) {
        payload.input_media_id = inputMediaId;
      }

      const res = await relayService.createDraft(activeSession.id, payload);
      const { job } = res.data.data;
      setJobId(job.id);
      pollJob(job.id, activeSession.id);
      setPrompt('');
    } catch (error) {
      console.error('Failed to start relay step', error);
      alert(error.response?.data?.error || 'Generation failed, please try again.');
      setGenerating(false);
    }
  };

  const handlePublish = async (draftId) => {
    if (!session) return;
    try {
      await relayService.publishDraft(session.id, draftId, {
        title: title || undefined,
        description: description || undefined,
      });
      await refreshSession(session.id);
      setGeneratedImage(null);
    } catch (error) {
      console.error('Publish failed', error);
      alert(error.response?.data?.error || 'Publish failed, please try again.');
    }
  };

  const handleDeleteDraft = async (draftId) => {
    if (!window.confirm('Delete this draft?')) return;
    try {
      await relayService.deleteDraft(draftId);
      setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    } catch (error) {
      console.error('Delete draft failed', error);
      alert(error.response?.data?.error || 'Delete failed');
    }
  };

  const handleRemoveInput = () => {
    setInputPreview(null);
    setInputMediaId(null);
  };

  const progressPercent = Math.min((stepsCompleted / MAX_STEPS) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">Relay Studio</h1>
              <p className="text-gray-300">
                Only one model, 1:1 aspect ratio. From step 2, the system adds "create based on the previous image" automatically.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white flex items-center gap-2">
                <Timer className="w-4 h-4" />
                <span>{stepsCompleted}/{MAX_STEPS}</span>
              </div>
              {session && (
                <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-sm">
                  Session #{session.id.slice(0, 6)}
                </div>
              )}
            </div>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="backdrop-blur-xl bg-slate-900/50 border border-purple-500/20 rounded-3xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">Prompt</h3>
                {stepsCompleted > 0 && (
                  <span className="text-xs text-gray-400">
                    System prompt will be added automatically
                  </span>
                )}
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe this panel of the story..."
                className="w-full h-32 bg-slate-800/60 rounded-2xl border border-purple-500/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 text-white p-4"
              />
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Optional title"
                  className="w-full bg-slate-800/60 rounded-2xl border border-purple-500/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 text-white p-3"
                />
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  className="w-full bg-slate-800/60 rounded-2xl border border-purple-500/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 text-white p-3"
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Fixed model: Gemini Nano Banana · 1:1 ratio</span>
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={generating || hasReachedLimit}
                  className="flex items-center gap-2 px-5"
                >
                  {generating ? (
                    <LoadingSpinner size="sm" text="Generating..." />
                  ) : (
                    <>
                      <span>Generate & Share</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-slate-900/50 border border-purple-500/20 rounded-3xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Published Steps</h3>
                <span className="text-sm text-gray-400">{stepsCompleted}/{MAX_STEPS}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {steps.map((step) => (
                  <div key={step.id} className="bg-slate-800/60 border border-purple-500/20 rounded-2xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-semibold">Step {step.step_number}</div>
                      <div className="text-xs text-gray-400">{step.status}</div>
                    </div>
                    {step.output_url ? (
                      <img
                        src={step.output_url}
                        alt={`Step ${step.step_number}`}
                        className="w-full aspect-square object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full aspect-square rounded-xl bg-slate-900/60 border border-dashed border-purple-500/30 flex items-center justify-center text-gray-500 text-sm">
                        Waiting for generation...
                      </div>
                    )}
                    <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                      {step.prompt_user}
                    </p>
                  </div>
                ))}
                {steps.length === 0 && (
                  <div className="text-gray-400 text-sm">
                    Publish the first image to start the grid.
                  </div>
                )}
              </div>
            </div>

            <div className="backdrop-blur-xl bg-slate-900/50 border border-purple-500/20 rounded-3xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Drafts (preview before publishing)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {drafts.map((draft) => (
                  <div key={draft.id} className="bg-slate-800/60 border border-purple-500/20 rounded-2xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-semibold text-sm">Draft</div>
                      <div className="text-xs text-gray-400">{draft.status}</div>
                    </div>
                    {draft.output_url ? (
                      <img
                        src={draft.output_url}
                        alt="Draft"
                        className="w-full aspect-square object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full aspect-square rounded-xl bg-slate-900/60 border border-dashed border-purple-500/30 flex items-center justify-center text-gray-500 text-sm">
                        Waiting for generation...
                      </div>
                    )}
                    <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                      {draft.prompt_user}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        onClick={() => handlePublish(draft.id)}
                        disabled={draft.status !== 'completed' || hasReachedLimit}
                        className="flex-1 flex items-center justify-center gap-2 px-3"
                      >
                        <Check className="w-4 h-4" />
                        Publish
                      </Button>
                      <button
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
                        title="删除草稿"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {drafts.length === 0 && (
                  <div className="text-gray-400 text-sm">
                    Drafts will appear here after generation; publish when you are happy.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="backdrop-blur-xl bg-slate-900/50 border border-purple-500/20 rounded-3xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">Reference (first step only)</h3>
                {inputPreview && (
                  <button
                    onClick={handleRemoveInput}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {inputPreview ? (
                <img
                  src={inputPreview}
                  alt="Reference"
                  className="w-full aspect-square object-cover rounded-2xl border border-purple-500/20"
                />
              ) : (
                <label className="border border-dashed border-purple-500/30 rounded-2xl h-48 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-purple-500/60 transition">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-sm">Upload an image for step 1 (optional)</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
              )}
              <p className="text-xs text-gray-500 mt-2">Later steps will automatically use the previous image.</p>
            </div>

            <div className="backdrop-blur-xl bg-slate-900/50 border border-purple-500/20 rounded-3xl p-4">
              <h3 className="text-white font-semibold mb-3">Latest Generation</h3>
              {generating && (
                <div className="flex items-center justify-center h-48">
                  <LoadingSpinner text="Generating..." />
                </div>
              )}
              {!generating && generatedImage && (
                <img
                  src={generatedImage}
                  alt="Latest generation"
                  className="w-full aspect-square object-cover rounded-2xl border border-purple-500/30"
                />
              )}
              {!generating && !generatedImage && (
                <div className="h-48 flex items-center justify-center text-gray-500 text-sm border border-dashed border-purple-500/30 rounded-2xl">
                  Generated images will show here
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelayPage;
