import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsService } from '../services/posts.service';
import { relayService } from '../services/relay.service';
import { uploadService } from '../services/upload.service';
import { formatDate, formatNumber } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Wand2, Image as ImageIcon } from 'lucide-react';
import { generationService } from '../services/generation.service';

const TABS = [
  { key: 'popular', label: 'Popular' },
  { key: 'latest', label: 'Latest' },
];

const HomePage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('popular');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [inputMediaId, setInputMediaId] = useState(null);
  const [creatingDraft, setCreatingDraft] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  const [results, setResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [overlayPrompt, setOverlayPrompt] = useState('');
  const pollRef = useRef(null);
  const [activeDraft, setActiveDraft] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const observerRef = useRef(null);
  const [liftFloating, setLiftFloating] = useState(false);
  const floatingRef = useRef(null);
  const [floatingHeight, setFloatingHeight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeRelay, setActiveRelay] = useState(null);
  const [attachedPreview, setAttachedPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const swipeStartXRef = useRef(null);

  const clearAttachment = () => {
    if (attachedPreview && attachedPreview.startsWith('blob:')) {
      URL.revokeObjectURL(attachedPreview);
    }
    setAttachedPreview(null);
    setInputMediaId(null);
    setSelectedFile(null);
  };

  const handleClosePreview = () => {
    if (attachedPreview || inputMediaId) {
      clearAttachment();
    }
    setShowPreview(false);
  };

  useEffect(() => {
    loadPosts(true);
  }, [activeTab]);

  const loadPosts = async (reset = false) => {
    setLoading(true);
    try {
      const targetPage = reset ? 1 : page;
      const limit = 12;
      let response;

      if (activeTab === 'popular') {
        response = await postsService.getPopular(targetPage, limit);
      } else {
        response = await postsService.getLatest(targetPage, limit);
      }

      const data =
        response?.data?.posts ||
        response?.posts ||
        response?.data ||
        [];

      if (reset) {
        setPosts(data);
        setPage(2);
      } else {
        setPosts((prev) => [...prev, ...data]);
        setPage(targetPage + 1);
      }
      setHasMore(data.length === limit);
    } catch (error) {
      console.error('Failed to load posts:', error);
      if (reset) setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    loadPosts(false);
  };

  useEffect(() => {
    const sentinel = observerRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          loadPosts(false);
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, activeTab, page]);

  useEffect(() => {
    const footerEl = document.querySelector('footer');
    if (!footerEl) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        setLiftFloating(first.isIntersecting);
      },
      { rootMargin: '0px' }
    );
    observer.observe(footerEl);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (floatingRef.current) {
      setFloatingHeight(floatingRef.current.getBoundingClientRect().height);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isExpanded) return;
      if (!floatingRef.current) return;
      if (!floatingRef.current.contains(e.target) && !prompt.trim()) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, prompt]);

  const currentResult = results[currentResultIndex] || null;

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      swipeStartXRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e, length = 0) => {
    if (!swipeStartXRef.current) return;
    const endX = e.changedTouches?.[0]?.clientX;
    const diff = endX - swipeStartXRef.current;
    swipeStartXRef.current = null;
    const threshold = 40;
    if (Math.abs(diff) < threshold || length < 2) return;
    if (diff < 0) {
      setCurrentResultIndex((idx) => (idx + 1) % length);
    } else {
      setCurrentResultIndex((idx) => (idx - 1 + length) % length);
    }
  };

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const resolveUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:3000${url}`;
  };

  const startJobPolling = (jobId, stayInModal = false, draftId) => {
    if (!jobId) return;
    if (pollRef.current) clearInterval(pollRef.current);

    setIsGenerating(true);
    setGenError('');
    setShowPreview(stayInModal);

    pollRef.current = setInterval(async () => {
      try {
        const res = await generationService.getJobStatus(jobId);
        const job = res.data?.job;
        if (!job) return;
        if (job.status === 'failed') {
          setGenError(job.error_message || 'Generation failed, please try again.');
          setIsGenerating(false);
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
        if (job.status === 'completed' && job.result_url) {
          const cleanedPrompt = job.prompt;
          setResults((prev) => {
            const next = [
              ...prev,
              {
                status: 'done',
                title: job.prompt,
                prompt: cleanedPrompt,
                image: job.result_url,
                mediaId: job.result_media_id,
                draftId,
              },
            ];
            setCurrentResultIndex(next.length - 1);
            setShowPreview(true);
            return next;
          });
          setIsGenerating(false);
          clearInterval(pollRef.current);
          pollRef.current = null;
          // refresh list to surface new post after publish
        }
      } catch (err) {
        console.error('Poll job failed', err);
        setIsGenerating(false);
        setGenError('Generation failed, please try again.');
        if (pollRef.current) {
          clearInterval(pollRef.current);
        }
        pollRef.current = null;
      }
    }, 2500);
  };

  const handlePublishGenerated = async () => {
    const currentResult = results[currentResultIndex];
    if (!activeDraft?.sessionId || !activeDraft?.draftId) {
      setIsExpanded(false);
      return;
    }
    if (!currentResult) return;
    const draftIdToPublish = currentResult.draftId || activeDraft.draftId;
    setIsPublishing(true);
    try {
      // Avoid long prompt hitting varchar limit; let backend apply default title
      await relayService.publishDraft(activeDraft.sessionId, draftIdToPublish, {
        title: null,
        visibility: 'public',
      });
      await loadPosts(true);
      setIsExpanded(false);
      setResults([]);
      setCurrentResultIndex(0);
      setActiveDraft(null);
      clearAttachment();
      setShowPreview(false);
    } catch (err) {
      console.error('Publish failed', err);
      alert(err.response?.data?.error || 'Failed to publish this image, please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSavePrivate = async () => {
    const currentResult = results[currentResultIndex];
    if (!activeDraft?.sessionId || !activeDraft?.draftId) {
      setIsExpanded(false);
      return;
    }
    if (!currentResult) return;
    const draftIdToPublish = currentResult.draftId || activeDraft.draftId;
    setIsPublishing(true);
    try {
      await relayService.publishDraft(activeDraft.sessionId, draftIdToPublish, {
        title: null,
        visibility: 'private',
      });
      setIsExpanded(false);
      setResults([]);
      setCurrentResultIndex(0);
      setActiveDraft(null);
      clearAttachment();
      setShowPreview(false);
    } catch (err) {
      console.error('Save to private failed', err);
      alert(err.response?.data?.error || 'Failed to save this image, please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, PNG, WebP, HEIC, and HEIF are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image too large (max 5MB).');
      return;
    }
    if (attachedPreview && attachedPreview.startsWith('blob:')) {
      URL.revokeObjectURL(attachedPreview);
    }
    const localUrl = URL.createObjectURL(file);
    setAttachedPreview(localUrl);
    setSelectedFile(file);
    setInputMediaId(null);
  };

  const handleCreateDraft = async (overridePrompt, stayInModal = false) => {
    if (overridePrompt && typeof overridePrompt !== 'string') {
      overridePrompt.preventDefault?.();
      overridePrompt.stopPropagation?.();
      overridePrompt = undefined;
    }
    const promptToUse = ((typeof overridePrompt === 'string' ? overridePrompt : prompt) || '').trim();
    if (!promptToUse) {
      setIsExpanded(true);
      alert('Please enter a prompt');
      return;
    }
    if (!user) {
      navigate('/register');
      return;
    }
    setIsExpanded(true);
    setCreatingDraft(true);
    setIsGenerating(true);
    setGenError('');
    setActiveDraft(null);
    if (stayInModal) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
    if (!stayInModal) {
      setResults([]);
      setCurrentResultIndex(0);
    }
    setPrompt(promptToUse);
    try {
      const sessionRes = await relayService.createSession();
      const sessionId = sessionRes.data.data.id;
      let mediaId = inputMediaId;
      if (!mediaId && selectedFile) {
        try {
          setUploading(true);
          const uploadResult = await uploadService.uploadFile(selectedFile);
          mediaId = uploadResult.mediaId || uploadResult.id;
          setInputMediaId(mediaId);
          if (uploadResult.fileUrl) {
            setAttachedPreview(uploadResult.fileUrl);
          }
        } catch (uploadError) {
          console.error('Upload failed', uploadError);
          alert('Upload failed, please retry.');
          setUploading(false);
          setCreatingDraft(false);
          setIsGenerating(false);
          return;
        } finally {
          setUploading(false);
        }
      }
      const draftRes = await relayService.createDraft(sessionId, {
        prompt: promptToUse,
        input_media_id: mediaId || undefined,
      });
      // Refresh user credits after draft creation (cost deducted server-side)
      refreshUser?.();
      const jobId = draftRes.data?.data?.job?.id;
      const draftId = draftRes.data?.data?.draft?.id;
      setActiveDraft({ sessionId, draftId, jobId });
      startJobPolling(jobId, stayInModal, draftId);
      setPrompt('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Failed to create draft', error);
      const status = error.response?.status;
      const message = error.response?.data?.error || 'Generation failed, please try again.';
      if (status === 429) {
        setGenError('Too many requests. Please wait a moment and try again.');
        alert('You are sending requests too quickly. Please wait a moment and try again.');
      } else {
        setGenError(message);
        alert(message);
      }
      setIsExpanded(true);
    } finally {
      setCreatingDraft(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-pink-500/30 blur-3xl rounded-full" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/30 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/20 blur-3xl rounded-full" />
      </div>

      <main className="flex-1">
        {/* Hero block (aligned with MeowStars style) */}
        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-2">
          <div className="text-center mb-4 flex flex-col items-center gap-2">
            <div className="text-sm uppercase tracking-widest text-purple-100/80">MeowVerse Relay</div>
            <h1 className="text-5xl sm:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                MeowMents
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white leading-tight">
              Start with a moment. Let others continue the story.
            </p>
            <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto leading-tight -mt-1">
              A dream, a thought, a scene — anything worth sharing.
            </p>
          </div>
        </div>

        {/* Tabs as sliding toggle */}
        <div className="relative max-w-6xl mx-auto px-4 pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative inline-flex items-center w-[200px] h-12 bg-white/5 border border-white/25 rounded-full px-2 shadow-lg backdrop-blur-lg overflow-hidden">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative z-10 flex-1 px-0 py-2 rounded-full font-semibold leading-none text-center transition-colors ${
                    activeTab === tab.key ? 'text-slate-900' : 'text-white/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <div
                className="absolute inset-y-1 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 transition-all duration-200 shadow-md"
                style={{
                  width: 'calc(50% - 4px)',
                  transform: activeTab === 'popular' ? 'translateX(0%)' : 'translateX(100%)',
                  left: '4px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="relative max-w-6xl mx-auto px-4">
          {loading && posts.length === 0 ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner text="Loading gallery..." />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-400 py-16">No posts yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="group relative w-full max-w-[360px] min-w-[220px] overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/60 hover:shadow-xl hover:shadow-purple-500/20 transition cursor-pointer backdrop-blur-xl"
                  onClick={() => {
                    const stepsArr = post.steps || post.relay_steps || [];
                    const lastStep = stepsArr[stepsArr.length - 1];
                    setActiveRelay(
                      stepsArr.length
                        ? {
                            sessionId: post.relay_session_id || post.session_id || 'mock-session',
                            lastStep,
                            stepIndex: stepsArr.length,
                          }
                        : null
                    );
                    navigate(`/post/${post.id}`);
                  }}
                >
                  <div className="aspect-[4/5] w-full overflow-hidden relative">
                    {(() => {
                      const steps = post.steps || post.relay_steps || [];
                      const apiThumbs = Array.isArray(post.step_thumbs) ? post.step_thumbs.filter(Boolean) : [];
                      const apiUrls = Array.isArray(post.step_urls) ? post.step_urls.filter(Boolean) : [];

                      let sourceImages = [];
                      if (apiThumbs.length > 0) {
                        sourceImages = apiThumbs;
                      } else if (apiUrls.length > 0) {
                        sourceImages = apiUrls;
                      } else {
                        sourceImages = steps.map(
                          (s) =>
                            s?.thumbnail_url ||
                            s?.media_url ||
                            s?.url ||
                            s?.original_url ||
                            post.thumbnail_url ||
                            post.original_url
                        );
                      }

                      const baseImages = sourceImages
                        .map(resolveUrl)
                        .filter(Boolean)
                        .slice(0, 6);
                      const fallback = resolveUrl(post.thumbnail_url || post.original_url);
                      const stepTotal =
                        post.step_count ??
                        post.steps_count ??
                        (post.step_thumbs?.length || steps.length || coverImages.length);

                      const coverImages = [...baseImages];

                      if (coverImages.length === 0 && fallback) {
                        coverImages.push(fallback);
                      }

                      // pad missing images up to reported stepTotal using fallback/first image
                      const padSrc = coverImages[0] || fallback;
                      while (coverImages.length < Math.min(Math.max(stepTotal, coverImages.length), 6)) {
                        if (!padSrc) break;
                        coverImages.push(padSrc);
                      }

                      if (stepTotal <= 1) {
                        return (
                          <img
                            src={coverImages[0]}
                            alt={post.title || 'Relay'}
                            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        );
                      }

                      let gridCols = 2;
                      let gridRows = 2;
                      let expected = 4;

                      if (stepTotal >= 4) {
                        gridCols = 3;
                        gridRows = 2;
                        expected = 6;
                      }

                      const tiles = [...coverImages];
                      while (tiles.length < expected) {
                        tiles.push(null);
                      }

                      return (
                        <div
                          className={`grid h-full w-full gap-1 bg-slate-900/40 ${
                            gridCols === 2 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-3 grid-rows-2'
                          }`}
                        >
                          {tiles.map((src, idx) =>
                            src ? (
                              <img
                                key={idx}
                                src={src}
                                alt={`Relay part ${idx + 1}`}
                                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div
                                key={idx}
                                className="w-full h-full bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 flex items-center justify-center text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"
                              >
                                🐾
                              </div>
                            )
                          )}
                        </div>
                      );
                    })()}
                    <div className="absolute top-2 right-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white border border-white/20 shadow">
                        {(
                          post.step_count ??
                          post.steps_count ??
                          (post.step_thumbs?.length || (post.steps || post.relay_steps || []).length || 1)
                        )}/{post.max_steps || 6}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    {/* Title removed; only description if present */}
                    {post.description && (
                      <p className="text-sm text-gray-200/80 line-clamp-2">{post.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-300/80">
                      <span>{formatDate(post.created_at)}</span>
                      <div className="flex items-center gap-3">
                        <span>❤️ {formatNumber(post.likes_count || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasMore && <div ref={observerRef} className="h-10" />}
        </div>

        <div className="h-32"></div>
      </main>

      {/* Floating generator fixed above footer */}
      <div
        className="fixed left-1/2 -translate-x-1/2 w-full px-4 z-40 pointer-events-none"
        style={{ bottom: liftFloating ? `${floatingHeight + 160}px` : '32px' }}
      >
        <div
          ref={floatingRef}
          className={`relative w-full max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-purple-900/70 via-slate-900/70 to-pink-900/70 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_-25px_rgba(168,85,247,0.7)] pointer-events-auto transition-all duration-200 ease-out origin-center overflow-hidden transform ${
            isExpanded
              ? `p-5 ${results.length > 0 ? 'min-h-[320px]' : 'h-[150px]'} scale-100`
              : 'p-3 h-[68px] scale-95'
          }`}
          onClick={() => setIsExpanded(true)}
        >
          {isExpanded ? (
            <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-1">
              {activeRelay && activeRelay.lastStep ? (
                <div className="mb-2 flex items-center gap-3 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 opacity-70" />
                    <span>Continuing from panel #{activeRelay.stepIndex || 1}</span>
                  </div>
                  {activeRelay.lastStep?.thumbnail_url && (
                    <img
                      src={activeRelay.lastStep.thumbnail_url}
                      alt="Prev"
                      className="w-10 h-10 rounded-lg object-cover border border-white/10"
                    />
                  )}
                </div>
              ) : null}
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`Start with a moment — a dream, a thought, a scene, or something you want to share.\nOthers will continue this moment as an interactive story.`}
                  className="w-full min-h-[96px] rounded-2xl px-5 pt-1 pb-6 text-white placeholder:text-white/70 focus:outline-none resize-none bg-transparent border-none transition-opacity"
                  style={{
                    color: '#fff',
                    opacity: isGenerating || creatingDraft ? 0.6 : 1,
                  }}
                  onFocus={() => setIsExpanded(true)}
                  disabled={isGenerating || creatingDraft}
                />
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <label
                  className="w-10 h-10 rounded-2xl border border-white/25 hover:border-purple-200 transition flex items-center justify-center cursor-pointer text-white/80 bg-white/5"
                >
                  {uploading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <ImageIcon className="w-5 h-5" />
                  )}
                  <input
                    id="floating-upload-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                    className="hidden"
                    onChange={handleUpload}
                  />
                </label>
                {attachedPreview ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/20">
                    <img
                      src={attachedPreview}
                      alt="Attached"
                      className="w-10 h-10 rounded-lg object-cover border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (attachedPreview && attachedPreview.startsWith('blob:')) {
                          URL.revokeObjectURL(attachedPreview);
                        }
                        setInputMediaId(null);
                        setAttachedPreview(null);
                        setSelectedFile(null);
                      }}
                      className="w-8 h-8 rounded-full text-lg leading-none text-white/80 hover:text-white flex items-center justify-center bg-white/10 hover:bg-white/20 transition"
                      aria-label="Remove attached image"
                    >
                      &times;
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={() => handleCreateDraft()}
                  disabled={creatingDraft}
                  className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 transition disabled:opacity-60 text-sm font-semibold"
                >
                  <Wand2 className={`w-5 h-5 ${creatingDraft || isGenerating ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between px-3 py-2 text-white/80 cursor-text">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 opacity-70" />
              </div>
              <div className="flex-1 text-center text-sm sm:text-base font-semibold">
                {isGenerating || creatingDraft
                  ? 'Generating...'
                  : '😼 Start with a moment. Let others continue the story. 😼'}
              </div>
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 opacity-70" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Preview overlay for generations */}
      {showPreview && (currentResult || isGenerating) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-8">
          <div className="relative w-full max-w-5xl bg-gradient-to-r from-purple-900/70 via-indigo-900/60 to-pink-900/70 border border-white/15 rounded-3xl shadow-2xl shadow-purple-500/20 overflow-hidden">
            <button
              onClick={handleClosePreview}
              className="absolute top-3 right-3 text-white/80 hover:text-white bg-white/10 rounded-full p-2"
              aria-label="Close preview"
            >
              ✕
            </button>
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {(currentResult?.title || isGenerating) && (
                <p className="text-white font-semibold text-lg">
                  {currentResult?.title || 'Generating...'}
                </p>
              )}
              {results.length > 0 && currentResult?.image && (
                <div
                  className="w-full max-h-[65vh] bg-black/20 rounded-2xl overflow-hidden flex items-center justify-center relative"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={(e) => handleTouchEnd(e, results.length)}
                >
                  {(isGenerating || currentResult?.status === 'pending') && (
                    <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-white/90">
                      <div className="w-12 h-12 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <p className="font-semibold">Generating</p>
                    </div>
                  )}
                  {results.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentResultIndex((idx) => (idx - 1 + results.length) % results.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition"
                        aria-label="Previous result"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => setCurrentResultIndex((idx) => (idx + 1) % results.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition"
                        aria-label="Next result"
                      >
                        ›
                      </button>
                    </>
                  )}
                  <img
                    src={currentResult.image}
                    alt="Generated preview"
                    className="max-h-[60vh] max-w-full object-contain"
                  />
                  {results.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {results.map((_, idx) => (
                        <span
                          key={idx}
                          onClick={() => setCurrentResultIndex(idx)}
                          className={`w-2 h-2 rounded-full cursor-pointer ${idx === currentResultIndex ? 'bg-white' : 'bg-white/40'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
              {genError && <p className="text-red-200 text-sm">{genError}</p>}
              {currentResult?.status === 'done' && (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={handlePublishGenerated}
                      disabled={isPublishing}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow"
                    >
                      {isPublishing ? 'Publishing...' : 'Start the rally with this image'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const fallbackPrompt =
                          prompt ||
                          currentResult.title ||
                          '';
                        if (!fallbackPrompt) {
                          alert('Please enter a prompt');
                          return;
                        }
                        handleCreateDraft(fallbackPrompt, true);
                      }}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
                    >
                      Generate another with this prompt
                    </button>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSavePrivate();
                    }}
                    disabled={isPublishing}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition text-center font-semibold"
                  >
                    {isPublishing ? 'Saving...' : 'Save to my private collection (only you can view)'}
                  </button>
                  <div className="flex items-center gap-3">
                    <textarea
                      value={overlayPrompt}
                      onChange={(e) => setOverlayPrompt(e.target.value)}
                      placeholder="Want a different vibe? Try a new idea to generate another image (it won’t edit the current one — it adds a new result)"
                      className="flex-1 min-h-[100px] px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400/60 resize-none overflow-y-auto"
                      style={{ touchAction: 'pan-y' }}
                      disabled={isGenerating}
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const next =
                          overlayPrompt.trim() ||
                          currentResult.title ||
                          '';
                        if (next) {
                          handleCreateDraft(next, true);
                          setOverlayPrompt('');
                        }
                      }}
                      disabled={isGenerating}
                      className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow disabled:opacity-60 flex items-center justify-center"
                    >
                      <Wand2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
