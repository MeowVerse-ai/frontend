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
  const { user } = useAuth();
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
  const [latestResult, setLatestResult] = useState(null);
  const pollRef = useRef(null);
  const [activeDraft, setActiveDraft] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const observerRef = useRef(null);
  const [liftFloating, setLiftFloating] = useState(false);
  const floatingRef = useRef(null);
  const [floatingHeight, setFloatingHeight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeRelay, setActiveRelay] = useState(null);

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
      const mock = [
        {
          id: 'mock1',
          title: 'Mock Relay 1',
          description: 'Single panel preview',
          relay_session_id: 'session-mock1',
          steps: [
            { thumbnail_url: 'https://picsum.photos/seed/a/600/800', media_id: 'media-mock1-step1' },
          ],
          max_steps: 6,
          likes_count: 12,
          comments_count: 3,
          created_at: new Date().toISOString(),
        },
        {
          id: 'mock3',
          title: 'Mock Relay 3',
          description: 'Three panels preview',
          relay_session_id: 'session-mock3',
          steps: [
            { thumbnail_url: 'https://picsum.photos/seed/b/600/800', media_id: 'media-mock3-step1' },
            { thumbnail_url: 'https://picsum.photos/seed/c/600/800', media_id: 'media-mock3-step2' },
            { thumbnail_url: 'https://picsum.photos/seed/d/600/800', media_id: 'media-mock3-step3' },
          ],
          max_steps: 6,
          likes_count: 45,
          comments_count: 10,
          created_at: new Date().toISOString(),
        },
        {
          id: 'mock6',
          title: 'Mock Relay Full',
          description: 'Six panels preview',
          relay_session_id: 'session-mock6',
          steps: Array.from({ length: 6 }, (_, i) => ({
            thumbnail_url: `https://picsum.photos/seed/${i + 10}/600/800`,
            media_id: `media-mock6-step${i + 1}`,
          })),
          max_steps: 6,
          likes_count: 100,
          comments_count: 25,
          created_at: new Date().toISOString(),
        },
        {
          id: 'mock4',
          title: 'Mock Relay 4',
          description: 'Four panels preview',
          relay_session_id: 'session-mock4',
          steps: Array.from({ length: 4 }, (_, i) => ({
            thumbnail_url: `https://picsum.photos/seed/${20 + i}/600/800`,
            media_id: `media-mock4-step${i + 1}`,
          })),
          max_steps: 6,
          likes_count: 64,
          comments_count: 14,
          created_at: new Date().toISOString(),
        },
        {
          id: 'mock5',
          title: 'Mock Relay 5',
          description: 'Five panels preview',
          relay_session_id: 'session-mock5',
          steps: Array.from({ length: 5 }, (_, i) => ({
            thumbnail_url: `https://picsum.photos/seed/${30 + i}/600/800`,
            media_id: `media-mock5-step${i + 1}`,
          })),
          max_steps: 6,
          likes_count: 82,
          comments_count: 19,
          created_at: new Date().toISOString(),
        },
        {
          id: 'mock2',
          title: 'Mock Relay 2',
          description: 'Two panels preview',
          relay_session_id: 'session-mock2',
          steps: Array.from({ length: 2 }, (_, i) => ({
            thumbnail_url: `https://picsum.photos/seed/${40 + i}/600/800`,
            media_id: `media-mock2-step${i + 1}`,
          })),
          max_steps: 6,
          likes_count: 28,
          comments_count: 7,
          created_at: new Date().toISOString(),
        },
      ];

      if (reset) {
        const filled = data.length ? data : mock;
        setPosts(filled);
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

  const startJobPolling = (jobId) => {
    if (!jobId) return;
    if (pollRef.current) clearInterval(pollRef.current);

    setIsGenerating(true);
    setGenError('');
    setLatestResult({ status: 'pending', title: 'Generating preview...' });

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
          setLatestResult({
            status: 'done',
            title: job.prompt,
            image: job.result_url,
            mediaId: job.result_media_id,
          });
          setIsGenerating(false);
          clearInterval(pollRef.current);
          pollRef.current = null;
          // refresh list to surface new post after publish
        }
      } catch (err) {
        console.error('Poll job failed', err);
      }
    }, 2500);
  };

  const handlePublishGenerated = async () => {
    if (!activeDraft?.sessionId || !activeDraft?.draftId) {
      setIsExpanded(false);
      return;
    }
    setIsPublishing(true);
    try {
      await relayService.publishDraft(activeDraft.sessionId, activeDraft.draftId, {});
      await loadPosts(true);
      setIsExpanded(false);
      setLatestResult(null);
      setActiveDraft(null);
    } catch (err) {
      console.error('Publish failed', err);
      alert(err.response?.data?.error || 'Failed to publish this image, please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Image too large (max 10MB).');
      return;
    }
    setUploading(true);
    try {
      const uploadResult = await uploadService.uploadFile(file);
      setInputMediaId(uploadResult.mediaId || uploadResult.id);
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed, please retry.');
      setInputMediaId(null);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateDraft = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    if (!user) {
      navigate('/register');
      return;
    }
    setCreatingDraft(true);
    setIsGenerating(true);
    setGenError('');
    setLatestResult(null);
    setActiveDraft(null);
    try {
      const sessionRes = await relayService.createSession();
      const sessionId = sessionRes.data.data.id;
      const draftRes = await relayService.createDraft(sessionId, {
        prompt,
        input_media_id: inputMediaId || undefined,
      });
      const jobId = draftRes.data?.data?.job?.id;
      const draftId = draftRes.data?.data?.draft?.id;
      setActiveDraft({ sessionId, draftId, jobId });
      startJobPolling(jobId);
      setPrompt('');
      setInputMediaId(null);
    } catch (error) {
      console.error('Failed to create draft', error);
      setGenError(error.response?.data?.error || 'Generation failed, please try again.');
      setIsExpanded(true);
    } finally {
      setCreatingDraft(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-pink-500/30 blur-3xl rounded-full" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/30 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/20 blur-3xl rounded-full" />
      </div>

      <main className="flex-1">
        {/* Compact hero */}
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-6">
          <div className="flex flex-col gap-3 items-center text-center">
            <div className="text-sm uppercase tracking-widest text-purple-100/80">MeowVerse Relay</div>
            <h1 className="text-5xl sm:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                MeowMents
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Dive into the greatest relays
            </p>
          </div>
        </div>

        {/* Tabs as sliding toggle */}
        <div className="relative max-w-6xl mx-auto px-4 pb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative flex bg-white/10 border border-white/20 rounded-full p-1 shadow-lg backdrop-blur overflow-hidden">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative z-10 px-5 py-2 rounded-full font-semibold transition-colors ${
                    activeTab === tab.key ? 'text-slate-900' : 'text-white/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <div
                className="absolute top-[3px] bottom-[3px] rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 transition-all duration-200 shadow-md"
                style={{
                  width: 'calc(50% - 6px)',
                  left: activeTab === 'popular' ? '3px' : 'calc(50% + 3px)',
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
              ? `p-5 ${latestResult?.image ? 'min-h-[320px]' : 'h-[150px]'} scale-100`
              : 'p-3 h-[68px] scale-95'
          }`}
          onClick={() => setIsExpanded(true)}
        >
          {isExpanded ? (
            <>
              {/* Inline generation result/preview */}
              {latestResult && (
                <div className="mb-3 rounded-2xl bg-black/30 border border-white/10 p-3">
                  {latestResult.status === 'pending' ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-3">
                      <div className="w-12 h-12 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <p className="text-white/80 font-semibold">Generating...</p>
                    </div>
                  ) : (
                    <>
                      {latestResult.title && (
                        <p className="text-white font-semibold text-base">{latestResult.title}</p>
                      )}
                    </>
                  )}
                  {latestResult.image && (
                    <img
                      src={latestResult.image}
                      alt="Preview"
                      className="mt-2 w-full rounded-xl object-contain max-h-96"
                    />
                  )}
                  {genError && <p className="text-sm text-red-200 mt-1">{genError}</p>}
                  {latestResult.status === 'done' && (
                    <div className="mt-3 flex gap-2">
                      <button
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow"
                        onClick={handlePublishGenerated}
                        disabled={isPublishing}
                      >
                        {isPublishing ? 'Publishing...' : 'Start the rally with this image'}
                      </button>
                      <button
                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
                        onClick={() => setLatestResult(null)}
                      >
                        Generate another with this prompt
                      </button>
                    </div>
                  )}
                </div>
              )}
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
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  latestResult?.status === 'done' && latestResult?.image
                    ? 'Tweak the prompt below if you want a different vibe.'
                    : 'Meanwhile in the MeowVerse… What’s the next scene? You can write in any language.'
                }
                className="w-full min-h-[96px] rounded-2xl px-5 pt-4 pb-6 text-white placeholder:text-white/70 focus:outline-none resize-none bg-transparent border-none"
                style={{ color: '#fff' }}
                onFocus={() => setIsExpanded(true)}
                disabled={isGenerating || creatingDraft}
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <label className="w-10 h-10 rounded-2xl border border-white/25 hover:border-purple-200 transition flex items-center justify-center cursor-pointer text-white/80 bg-white/5">
                  {uploading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <ImageIcon className="w-5 h-5" />
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
              </div>
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={handleCreateDraft}
                disabled={creatingDraft}
                className="w-10 h-10 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 transition disabled:opacity-60"
              >
                  {creatingDraft || isGenerating ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Wand2 className="w-5 h-5" />
                  )}
              </button>
            </div>
          </>
          ) : (
            <div className="flex items-center justify-between px-3 py-2 text-white/80 cursor-text">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 opacity-70" />
              </div>
              <div className="flex-1 text-center text-sm sm:text-base font-semibold">
                {isGenerating || creatingDraft ? (
                  <span className="inline-flex items-center gap-2 text-white/80">
                    <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Generating...
                  </span>
                ) : (
                  '😼 Meanwhile in the MeowVerse… What’s the next scene? 😼'
                )}
              </div>
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 opacity-70" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
