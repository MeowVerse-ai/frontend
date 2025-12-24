import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Eye, Share2, ArrowLeftToLine, User, Wand2, X, Copy, MessageSquare, Instagram, Check } from 'lucide-react';
import { postsService } from '../services/posts.service';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatNumber, formatDate } from '../utils/helpers';
import { relayService } from '../services/relay.service';
import { useAuth } from '../context/AuthContext';
import { generationService } from '../services/generation.service';
import api from '../services/api';

const stripSystemPrompt = (text = '') => {
  if (!text) return text;
  const marker = 'Continue with this picture.';
  return text.startsWith(marker) ? text.slice(marker.length).trimStart() : text;
};

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [relayPrompt, setRelayPrompt] = useState('');
  const [creatingDraft, setCreatingDraft] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  const [lastUsedPrompt, setLastUsedPrompt] = useState('');
  const [overlayPrompt, setOverlayPrompt] = useState('');
  const [activeBaseMediaId, setActiveBaseMediaId] = useState(null);
  const [mainSlide, setMainSlide] = useState({ offset: 0, animating: false });
  const [previewSlide, setPreviewSlide] = useState({ offset: 0, animating: false });
  const [mainDrag, setMainDrag] = useState({ active: false, offset: 0, width: 0 });
  const [previewDrag, setPreviewDrag] = useState({ active: false, offset: 0, width: 0 });
  const swipeStartXRef = useRef(null);
  const swipePreviewStartXRef = useRef(null);
  const [activeDraft, setActiveDraft] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const pollRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [viewTracked, setViewTracked] = useState(false);
  const [updateNotice, setUpdateNotice] = useState(false);

  useEffect(() => {
    loadPost();
    setCurrentIndex(0);
  }, [postId]);

  useEffect(() => {
    const stepsArr = post?.steps || post?.relay_steps || [];
    if (stepsArr.length > 0) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(0);
    }
  }, [post?.steps, post?.relay_steps, post?.original_url]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, []);

  const handleMainTouchStart = (e, widthGetter) => {
    if (e.touches && e.touches.length > 0) {
      swipeStartXRef.current = e.touches[0].clientX;
      const w = widthGetter?.() || 0;
      setMainDrag((prev) => ({ ...prev, active: true, offset: 0, width: w }));
    }
  };

  const handleMainTouchMove = (e) => {
    if (!mainDrag.active || !swipeStartXRef.current) return;
    const currentX = e.touches?.[0]?.clientX;
    if (currentX === undefined) return;
    const diff = currentX - swipeStartXRef.current;
    setMainDrag((prev) => ({ ...prev, offset: diff }));
  };

  const handleMainTouchEnd = (length = 0) => {
    if (!swipeStartXRef.current) {
      setMainDrag({ active: false, offset: 0, width: mainDrag.width });
      return;
    }
    const diff = mainDrag.offset;
    swipeStartXRef.current = null;
    if (length < 2) {
      setMainDrag({ active: false, offset: 0, width: mainDrag.width });
      return;
    }
    const threshold = Math.max(40, (mainDrag.width || 0) * 0.15);
    if (Math.abs(diff) < threshold) {
      setMainDrag({ active: false, offset: 0, width: mainDrag.width });
      return;
    }
    triggerMainSlide(diff < 0 ? 'next' : 'prev');
  };

  const handlePreviewTouchStart = (e, widthGetter) => {
    if (e.touches && e.touches.length > 0) {
      swipePreviewStartXRef.current = e.touches[0].clientX;
      const w = widthGetter?.() || 0;
      setPreviewDrag((prev) => ({ ...prev, active: true, offset: 0, width: w }));
    }
  };

  const handlePreviewTouchMove = (e) => {
    if (!previewDrag.active || !swipePreviewStartXRef.current) return;
    const currentX = e.touches?.[0]?.clientX;
    if (currentX === undefined) return;
    const diff = currentX - swipePreviewStartXRef.current;
    setPreviewDrag((prev) => ({ ...prev, offset: diff }));
  };

  const handlePreviewTouchEnd = (length = 0) => {
    if (!swipePreviewStartXRef.current) {
      setPreviewDrag({ active: false, offset: 0, width: previewDrag.width });
      return;
    }
    const diff = previewDrag.offset;
    swipePreviewStartXRef.current = null;
    if (length < 2) {
      setPreviewDrag({ active: false, offset: 0, width: previewDrag.width });
      return;
    }
    const threshold = Math.max(40, (previewDrag.width || 0) * 0.15);
    if (Math.abs(diff) < threshold) {
      setPreviewDrag({ active: false, offset: 0, width: previewDrag.width });
      return;
    }
    triggerPreviewSlide(diff < 0 ? 'next' : 'prev');
  };

  // Poll for new relay steps so users see updates if someone else just added one
  useEffect(() => {
    if (!postId) return;
    const interval = setInterval(async () => {
      try {
        const resp = await postsService.getById(postId);
        const fetchedPost = resp?.data?.data || resp?.data || resp;
        const newCount = (fetchedPost?.steps || fetchedPost?.relay_steps || []).length;
        const currentCount = (post?.steps || post?.relay_steps || []).length;
        if (newCount > currentCount) {
          setPost(fetchedPost);
          setUpdateNotice(true);
          setTimeout(() => setUpdateNotice(false), 3000);
        }
      } catch (err) {
        console.error('Polling post updates failed:', err);
      }
    }, 25000);
    return () => clearInterval(interval);
  }, [postId, post]);

  const loadPost = async () => {
    setLoading(true);
    try {
      console.log('🔍 Loading post ID:', postId);
      const response = await postsService.getById(postId);
      console.log('✅ Post response:', response);
      // normalize API shapes: {success, data}, or {data}, or direct object
      const fetchedPost =
        response?.data?.data || // e.g. axios full response forwarded
        response?.data || // e.g. {success, data: {...}}
        response; // already the post object
      setPost(fetchedPost);
      window.__POST__ = fetchedPost;

      // Track a view once per mount
      if (!viewTracked) {
        postsService.recordView(postId);
        setViewTracked(true);
      }
    } catch (error) {
      console.error('❌ Failed to load post:', error);
      console.error('Error response:', error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like posts.');
      navigate('/login');
      return;
    }
    try {
      if (post.is_liked) {
        await postsService.unlikePost(post.id);
      } else {
        await postsService.likePost(post.id);
      }
      loadPost();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    // Comments disabled in MVP; keep for future
    return;
  };

  const handleCommentAdded = async () => {
    // Reload post to update comment count
    return;
  };

  const stripSystemPrefix = (text = '') => {
    const prefixes = [
      'Continue with this picture. Keep the same main subject, style, lighting, and environment. Preserve the camera angle and color palette. Extend the scene naturally; do not introduce new characters or settings unless implied by the prompt.',
    ];
    let cleaned = text || '';
    prefixes.forEach((p) => {
      if (cleaned.startsWith(p)) {
        cleaned = cleaned.slice(p.length).trimStart();
      }
    });
    return cleaned;
  };

  const handleRelayDraft = async (promptText) => {
    if (!user) {
      alert('Please login to create a relay step.');
      navigate('/login');
      return;
    }
    setLockMessage('');
    if (!promptText.trim()) {
      alert('Please enter a prompt');
      return;
    }
    if (!post?.relay_session_id) {
      alert('This post is not linked to a relay session.');
      return;
    }
    if (!lastStepMediaId) {
      alert('No reference image found for this relay.');
      return;
    }
    if (isComplete) return;
    setCreatingDraft(true);
    setLastUsedPrompt(promptText);
    try {
      const res = await relayService.createDraft(post.relay_session_id, {
        prompt: promptText,
        input_media_id: lastStepMediaId,
      });
      const jobId = res.data?.data?.job?.id;
      const draftId = res.data?.data?.draft?.id;
      if (draftId) {
        setActiveDraft({ sessionId: post.relay_session_id, draftId });
      }
      refreshUser?.();
      return { jobId, draftId };
    } catch (error) {
      console.error('Failed to create relay draft:', error);
      const status = error.response?.status;
      const message = error.response?.data?.error || 'Generation failed, please try again.';
      if (status === 409) {
        const lowerMsg = message.toLowerCase();
        setLockMessage(
          message.includes('cooldown') ||
          lowerMsg.includes('wait 6 hours') ||
          lowerMsg.includes('last panel')
            ? 'The same author must wait 6 hours before continuing.'
            : 'Someone is currently continuing this story, please try again later.'
        );
      } else if (status === 429) {
        setLockMessage('Too many requests. Please wait a moment before trying again.');
        setGenError('Too many requests. Please wait and retry.');
        alert('You are sending requests too quickly. Please wait a moment and try again.');
      } else {
        setLockMessage('');
        alert(message);
      }
      // Ensure UI stops showing "Generating" if parent already set it
      setIsGenerating(false);
      setGenError(message);
    } finally {
      setCreatingDraft(false);
    }
  };

  const resolveUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:3000${url}`;
  };

  const stepsArr = post?.steps || post?.relay_steps || [];
  const lastIndex = stepsArr.length ? stepsArr.length - 1 : 0;
  const lastStep = stepsArr[lastIndex];
  const lastStepMediaId = lastStep?.media_id || lastStep?.output_media_id || post?.media_id;
  useEffect(() => {
    const newBase = lastStepMediaId || null;
    setActiveBaseMediaId((prev) => {
      if (prev && newBase && prev !== newBase) {
        setResults([]);
        setCurrentResultIndex(0);
      }
      return newBase;
    });
  }, [lastStepMediaId]);
  const isComplete = stepsArr.length >= 6;
  const isPrivate = post?.visibility === 'private';
  const [lockMessage, setLockMessage] = useState('');

  const isPromptFilled = relayPrompt.trim().length > 0;
  const canSubmit = !isComplete && !isPrivate && !!lastStepMediaId && !creatingDraft;
  const participants = (() => {
    const seen = new Set();
    const list = [];
    (stepsArr || []).forEach((s) => {
      const uname = s?.username || post?.username;
      if (uname && !seen.has(uname)) {
        seen.add(uname);
        list.push({ username: uname });
      }
    });
    if (list.length === 0 && post?.username) {
      list.push({ username: post.username });
    }
    return list;
  })();

  const imageSources = (() => {
    const urls = stepsArr
      .map((s) => s?.original_url || s?.media_url || s?.thumbnail_url || s?.url)
      .filter(Boolean);
    if (urls.length === 0 && post?.original_url) {
      urls.push(post.original_url);
    }
    return urls;
  })();

  const triggerMainSlide = (dir) => {
    if (imageSources.length <= 1 || dir === null) return;
    const target =
      dir === 'next'
        ? (currentIndex + 1) % imageSources.length
        : (currentIndex - 1 + imageSources.length) % imageSources.length;
    const startOffset = mainDrag.offset || 0;
    setCurrentIndex(target);
    setMainSlide({ offset: startOffset, animating: true });
    requestAnimationFrame(() => setMainSlide({ offset: 0, animating: true }));
    setTimeout(() => {
      setMainSlide({ offset: 0, animating: false });
      setMainDrag({ active: false, offset: 0, width: 0 });
    }, 200);
  };

  const handlePrevImage = () => triggerMainSlide('prev');
  const handleNextImage = () => triggerMainSlide('next');

  const triggerPreviewSlide = (dir) => {
    if (results.length <= 1 || dir === null) return;
    const target =
      dir === 'next'
        ? (currentResultIndex + 1) % results.length
        : (currentResultIndex - 1 + results.length) % results.length;
    const startOffset = previewDrag.offset || 0;
    setCurrentResultIndex(target);
    setPreviewSlide({ offset: startOffset, animating: true });
    requestAnimationFrame(() => setPreviewSlide({ offset: 0, animating: true }));
    setTimeout(() => {
      setPreviewSlide({ offset: 0, animating: false });
      setPreviewDrag({ active: false, offset: 0, width: 0 });
    }, 200);
  };

  const shareLink = typeof window !== 'undefined' ? window.location.href : '';
  const shareText =
    `Come continue this MeowVerse relay with me! ${shareLink}`;

  const handleShareClick = () => setShowShareModal(true);

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleShareInstagram = () => {
    navigator.clipboard.writeText(shareLink);
    window.open('https://www.instagram.com/', '_blank');
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const shareToWeChat = () => {
    navigator.clipboard
      .writeText(shareText)
      .then(() => alert('Copied share text for WeChat. Paste into chat.'))
      .catch((err) => console.error('WeChat copy failed', err));
  };

  const shareToXHS = () => {
    navigator.clipboard
      .writeText(shareText)
      .then(() => alert('Copied share text for XiaoHongShu. Paste into your post.'))
      .catch((err) => console.error('XHS copy failed', err));
  };

  const WeChatIcon = () => null;
  const XHSIcon = () => null;

  const handleDelete = async () => {
    if (!post) return;
    const confirmDelete = window.confirm(
      'Remove this from the gallery? This is only allowed before others join the relay.'
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await api.delete(`/posts/${post.id}`);
      alert('Removed from gallery.');
      navigate('/');
    } catch (err) {
      console.error('Delete failed', err);
      alert(err.response?.data?.error || 'Failed to remove post.');
    } finally {
      setIsDeleting(false);
    }
  };

  const startJobPolling = (jobId, draftId, sessionId) => {
    if (!jobId) return;
    if (pollRef.current) clearTimeout(pollRef.current);
    setIsGenerating(true);
    setGenError('');

    const poll = async (delayMs = 4000) => {
      try {
        const res = await generationService.getJobStatus(jobId);
        const job = res.data?.job;
        if (!job) return;
        if (job.status === 'failed') {
          setGenError(job.error_message || 'Generation failed, please try again.');
          setIsGenerating(false);
          clearTimeout(pollRef.current);
          pollRef.current = null;
          return;
        }
        const imageUrl =
          job.result_url ||
          job.result?.url ||
          job.result?.image_url ||
          job.result?.image ||
          job.result?.[0]?.url;

        if (job.status === 'completed') {
          clearTimeout(pollRef.current);
          pollRef.current = null;
          setIsGenerating(false);

          if (imageUrl) {
            const cleaned = stripSystemPrompt(job.prompt || '');
            setResults((prev) => {
              const next = [
                ...prev,
                {
                  status: 'done',
                  title: job.prompt,
                  prompt: cleaned,
                  image: imageUrl,
                  mediaId: job.result_media_id,
                  draftId,
                  sessionId,
                },
              ];
              setCurrentResultIndex(next.length - 1);
              return next;
            });
            setLastUsedPrompt(cleaned || lastUsedPrompt || relayPrompt);
            loadPost();
            setShowPreview(true);
          } else {
            // Fallback: reload post and try last step media
            const fallbackPostResp = await postsService.getById(postId);
            const fallbackPost =
              fallbackPostResp?.data?.data ||
              fallbackPostResp?.data ||
              fallbackPostResp;
            const refreshedSteps = (fallbackPost?.steps || fallbackPost?.relay_steps || []);
            const refreshedLast = refreshedSteps[refreshedSteps.length - 1] || {};
            const fallbackUrl =
              refreshedLast.original_url ||
              refreshedLast.media_url ||
              refreshedLast.thumbnail_url ||
              fallbackPost?.original_url;

              if (fallbackUrl) {
                const cleaned = stripSystemPrompt(job.prompt || '');
                const resolved = resolveUrl(fallbackUrl);
                setResults((prev) => {
                  const next = [
                    ...prev,
                    {
                      status: 'done',
                      title: job.prompt,
                      prompt: cleaned,
                      image: resolved,
                      mediaId: refreshedLast.output_media_id || job.result_media_id,
                      draftId,
                      sessionId,
                    },
                  ];
                  setCurrentResultIndex(next.length - 1);
                  return next;
                });
                setLastUsedPrompt(cleaned || lastUsedPrompt || relayPrompt);
                setShowPreview(true);
              } else {
                setGenError('Generation completed but no image returned.');
                setShowPreview(false);
            }
          }
        } else {
          // keep polling
          pollRef.current = setTimeout(() => poll(delayMs), delayMs);
        }
      } catch (err) {
        const status = err?.response?.status;
        if (status === 429) {
          const nextDelay = Math.min(delayMs * 2, 15000);
          pollRef.current = setTimeout(() => poll(nextDelay), nextDelay);
          return;
        }
        console.error('Poll job failed', err);
        setIsGenerating(false);
        if (pollRef.current) {
          clearTimeout(pollRef.current);
        }
        pollRef.current = null;
      }
    };

    poll();
  };

  const runInlineRelay = async (promptText, stayInModal = false) => {
    if (!promptText.trim()) {
      alert('Please enter a prompt');
      return;
    }
    if (!user) {
      alert('Please login to continue the relay.');
      navigate('/login');
      return;
    }
    if (!lastStepMediaId || isComplete) return;

    setLockMessage('');
    setIsGenerating(true);
    setGenError('');
    setShowPreview(stayInModal);
    try {
      const res = await handleRelayDraft(promptText);
      if (res?.jobId) {
        startJobPolling(res.jobId, res?.draftId, post?.relay_session_id);
        return;
      }
      // If no job returned (e.g., blocked/verification required), stop the loading state
      setIsGenerating(false);
      setGenError(res?.message || '');
    } catch (err) {
      setGenError(err?.response?.data?.error || 'Generation failed, please try again.');
      setIsGenerating(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading meowment..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-6">😿</div>
          <p className="text-2xl text-gray-400 mb-8">Post not found</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-semibold hover:scale-105 transition-transform"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentResult = results[currentResultIndex];

  const handlePublishGenerated = async () => {
    const currentResult = results[currentResultIndex];
    if (!activeDraft?.sessionId || !activeDraft?.draftId) {
      setShowPreview(false);
      return;
    }
    if (!currentResult) return;
    const draftIdToPublish = currentResult.draftId || activeDraft.draftId;
    const sessionIdToPublish = currentResult.sessionId || activeDraft.sessionId;
    setIsPublishing(true);
    try {
      // Avoid pushing long prompt into title; let backend default apply
      await relayService.publishDraft(sessionIdToPublish, draftIdToPublish, {
        title: null,
      });
      await loadPost();
      setShowPreview(false);
      setResults([]);
      setCurrentResultIndex(0);
      setActiveBaseMediaId(lastStepMediaId || activeBaseMediaId);
      setActiveDraft(null);
    } catch (err) {
      console.error('Publish action failed', err);
      const message = err?.response?.data?.error || 'Failed to publish this step.';
      if (err?.response?.status === 409) {
        alert(`${message}\nPlease regenerate from the latest image.`);
        setActiveDraft(null);
        setShowPreview(false);
        await loadPost();
      } else {
        alert(message);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-950/90 via-indigo-950/85 to-pink-900/90 pt-24 pb-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftToLine size={24} />
          <span>Back</span>
        </button>

        <div className={`grid grid-cols-1 ${isPrivate ? '' : 'lg:grid-cols-3'} gap-8 items-stretch`}>
          {/* Left: Content */}
          <div className={`${isPrivate ? 'lg:col-span-3' : 'lg:col-span-2'} h-full flex flex-col`}>
                  <div className="relative group h-full flex flex-col">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-400/60 to-purple-500/60 rounded-3xl blur-xl opacity-50"></div>
              <div className="relative bg-gradient-to-r from-purple-900/60 via-indigo-900/55 to-pink-800/60 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-[0_20px_60px_-25px_rgba(168,85,247,0.6)] h-full flex flex-col">
                {imageSources.length === 0 ? (
                  <div className="p-10 text-center text-gray-500">No media available</div>
                ) : (
                  <>
                    <div
                      className="relative"
                      onTouchStart={(e) => handleMainTouchStart(e, () => e.currentTarget.clientWidth)}
                      onTouchMove={handleMainTouchMove}
                      onTouchEnd={() => handleMainTouchEnd(imageSources.length)}
                    >
                      {isPrivate && (
                        <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-semibold">
                          Private — only you can view
                        </div>
                      )}
                      {imageSources[currentIndex]?.match(/\.(mp4|webm|mov)$/i) ? (
                        <div className="p-3 bg-slate-900/80">
                          <video
                            src={resolveUrl(imageSources[currentIndex])}
                            className="w-full h-auto object-contain max-h-[80vh] rounded-2xl"
                            loop
                            autoPlay
                            muted
                            playsInline
                          />
                        </div>
                      ) : (
                      <div className="relative w-full h-full min-h-[320px] md:min-h-[480px] overflow-hidden flex items-center justify-center">
                          {(() => {
                            const currentUrl = resolveUrl(imageSources[currentIndex]);
                            const offset = mainDrag.active ? mainDrag.offset : mainSlide.offset;
                            const transitioning = !mainDrag.active && mainSlide.animating;
                            const currentStyle = {
                              transition: transitioning ? 'transform 200ms ease' : 'none',
                              transform: `translateX(${offset}px)`,
                            };
                            return (
                              <>
                                <img
                                  src={currentUrl}
                                  alt={post.title}
                                  className="absolute inset-0 w-full h-full object-contain max-h-[80vh]"
                                  style={currentStyle}
                                />
                              </>
                            );
                          })()}
                        </div>
                      )}

                      {imageSources.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition"
                          >
                            ‹
                          </button>
                          <button
                            onClick={handleNextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition"
                          >
                            ›
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {imageSources.map((_, idx) => (
                              <span
                                key={idx}
                                className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/40'}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Panel info below media */}
                    <div className="mt-0 rounded-b-2xl rounded-t-none p-3 bg-gradient-to-r from-purple-900/70 via-indigo-900/65 to-pink-900/70 backdrop-blur-xl shadow-inner shadow-purple-500/10">
                      <div className="flex items-center justify-between text-sm text-white/85">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-white/70" />
                          <span className="font-semibold">
                            {stepsArr[currentIndex]?.username || post.username || 'Unknown'}
                          </span>
                        </div>
                        <div className="text-xs text-white/70">Panel #{currentIndex + 1}</div>
                      </div>
                      {(() => {
                        const step = stepsArr[currentIndex] || {};
                        const promptText =
                          step.user_prompt ||
                          step.prompt_user ||
                          step.prompt_full ||
                          step.prompt ||
                          step.userPrompt ||
                          step.promptUser ||
                          step.promptFull ||
                          step.title ||
                          post?.prompt ||
                          post?.description;
                        return promptText ? (
                          <div className="mt-2 text-sm text-white/85 max-h-24 overflow-auto">
                            {stripSystemPrompt(promptText)}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Details & Comments */}
          {!isPrivate && (
              <div className="lg:col-span-1 h-full">
            <div className="bg-gradient-to-r from-purple-900/60 via-indigo-900/55 to-pink-900/60 backdrop-blur-2xl rounded-3xl p-6 h-full flex flex-col shadow-[0_20px_60px_-25px_rgba(168,85,247,0.7)]">
              {/* Participants strip */}
              <div className="mb-6 pb-6 border-b border-purple-500/20">
                <h3 className="text-sm uppercase tracking-wide text-gray-300 mb-3">
                  Imagined and created by
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex -space-x-2 flex-wrap">
                    {participants.map((p, idx) => (
                      <div
                        key={`${p.username}-${idx}`}
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white font-semibold flex items-center justify-center border border-white/20"
                        title={p.username}
                      >
                        {p.username?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-gray-300">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-2 transition-all ${
                        post.is_liked
                          ? 'text-pink-400'
                          : 'text-gray-400 hover:text-pink-400'
                      }`}
                    >
                      <Heart size={18} fill={post.is_liked ? 'currentColor' : 'none'} />
                      <span className="font-semibold">{formatNumber(post.likes_count || 0)}</span>
                    </button>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Eye size={18} />
                      <span>{formatNumber(post.views_count || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Relay continuation single card */}
              {post.relay_session_id && (
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex">
                    <button
                      onClick={handleShareClick}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-blue-500/80 text-white font-semibold hover:from-pink-400 hover:via-purple-400 hover:to-blue-400 shadow-lg shadow-purple-500/20 transition"
                    >
                      <Share2 size={16} />
                      <span>Create together with friends!</span>
                    </button>
                  </div>
                  {updateNotice && (
                    <div className="px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-amber-100 text-sm">
                      Relay just got a new update. Refreshed content is loaded.
                    </div>
                  )}
                  <div className="bg-gradient-to-r from-purple-900/55 via-indigo-900/55 to-pink-900/55 backdrop-blur-2xl shadow-2xl shadow-purple-500/15 rounded-3xl p-5 flex flex-col gap-4 h-full">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 flex-shrink-0">
                        <img
                          src={resolveUrl(
                            lastStep?.thumbnail_url ||
                              lastStep?.original_url ||
                              post.thumbnail_url ||
                              post.original_url
                          )}
                          alt="Reference"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold truncate">
                          {isComplete ? 'Relay complete' : `Continuing from panel #${lastIndex + 1}`}
                        </div>
                        <div className="text-xs text-white/70 pointer-events-none">
                          Based on the latest image. 
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-3">
                      <div className="relative flex-1">
                        <textarea
                        value={relayPrompt}
                        onChange={(e) => setRelayPrompt(e.target.value)}
                        placeholder={
                          isPrivate
                            ? 'This is a private post. Relays are disabled.'
                            : 'Describe how the story continues with your imagination. You can write in any language. It will only continue from the latest panel (not earlier ones). More detail gives better results.'
                        }
                        className="w-full h-full bg-white/5 backdrop-blur-2xl border border-white/15 rounded-2xl pl-4 pr-16 pt-4 pb-16 text-white placeholder:text-white/75 focus:outline-none focus:border-purple-200 focus:ring-2 focus:ring-purple-400/40 resize-none min-h-[260px] shadow-inner shadow-purple-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isComplete || isGenerating || isPrivate}
                        aria-label="Relay prompt"
                      />
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                          <button
                            onClick={() => runInlineRelay(relayPrompt)}
                            disabled={isComplete || isPrivate || !lastStepMediaId || creatingDraft}
                            className={`w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 transition ${isPromptFilled ? '' : 'opacity-40'}`}
                            title="Continue relay"
                            aria-label="Continue relay"
                          >
                            <Wand2 size={18} />
                          </button>
                        </div>
                        {(creatingDraft || isGenerating) && (
                          <div className="absolute inset-0 rounded-2xl bg-slate-950/60 flex items-center justify-center z-10">
                            <LoadingSpinner size="sm" text="Generating" />
                          </div>
                        )}
                        {isComplete && (
                          <div className="absolute inset-0 bg-slate-950/70 rounded-2xl flex items-center justify-center text-white/75 text-sm">
                            Relay is complete (6/6)
                          </div>
                        )}
                        {isPrivate && (
                          <div className="absolute inset-0 bg-slate-950/70 rounded-2xl flex items-center justify-center text-white/75 text-sm text-center px-6">
                            This is a private post. Relays are disabled.
                          </div>
                        )}
                      </div>
                      {lockMessage && (
                        <div className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-400/40 text-amber-200 text-sm">
                          {lockMessage}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
      </div>
      {/* Fullscreen preview overlay */}
      {showPreview && (currentResult || isGenerating) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-8">
          <div className="relative w-full max-w-5xl bg-gradient-to-r from-purple-900/70 via-indigo-900/60 to-pink-900/70 border border-white/15 rounded-3xl shadow-2xl shadow-purple-500/20 overflow-hidden">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-3 right-3 text-white/80 hover:text-white bg-white/10 rounded-full p-2"
              aria-label="Close preview"
            >
              <X size={16} />
            </button>
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto" style={{ touchAction: 'pan-y' }}>
              {(currentResult?.title || isGenerating) && (
                <p className="text-white font-semibold text-lg">
                  {currentResult?.title ? stripSystemPrefix(currentResult.title) : 'Generating...'}
                </p>
              )}
              {results.length > 0 && currentResult?.image && (
                <div
                  className="w-full max-h-[65vh] bg-black/20 rounded-2xl overflow-hidden flex items-center justify-center relative"
                  onTouchStart={(e) => handlePreviewTouchStart(e, () => e.currentTarget.clientWidth)}
                  onTouchMove={handlePreviewTouchMove}
                  onTouchEnd={() => handlePreviewTouchEnd(results.length)}
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
                        onClick={() => triggerPreviewSlide('prev')}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition"
                        aria-label="Previous result"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => triggerPreviewSlide('next')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition"
                        aria-label="Next result"
                      >
                        ›
                      </button>
                    </>
                  )}
                  {currentResult.image && (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                      {(() => {
                        const offset = previewDrag.active ? previewDrag.offset : previewSlide.offset;
                        const transitioning = !previewDrag.active && previewSlide.animating;
                        const style = {
                          transition: transitioning ? 'transform 200ms ease' : 'none',
                          transform: `translateX(${offset}px)`,
                        };
                        return (
                          <img
                            src={currentResult.image}
                            alt="Generated preview"
                            className="max-h-[60vh] max-w-full object-contain"
                            style={style}
                          />
                        );
                      })()}
                    </div>
                  )}
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
                      {isPublishing ? 'Publishing...' : 'Continue the rally with this image'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const nextPrompt =
                          lastUsedPrompt ||
                          stripSystemPrefix(currentResult.title || '') ||
                          relayPrompt;
                        if (nextPrompt) {
                          runInlineRelay(nextPrompt, true);
                        } else {
                          setIsGenerating(false);
                        }
                        setActiveDraft(null);
                        // keep preview open
                      }}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
                    >
                      Generate another with this prompt
                    </button>
                  </div>
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
                          stripSystemPrompt(currentResult.title || '') ||
                          relayPrompt;
                        if (next) {
                          runInlineRelay(next, true);
                          setOverlayPrompt('');
                          // keep preview open
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
      {showShareModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="relative bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
            <div className="mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Share with Friends
              </h2>
              <p className="text-gray-400">Invite friends to co-create.</p>
            </div>
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Share link</label>
              <div className="flex gap-2 items-center">
                <div className="flex-1 bg-slate-800/60 rounded-xl px-4 py-3 border border-purple-500/20 overflow-hidden">
                  <p className="text-white text-sm truncate whitespace-nowrap">{shareLink}</p>
                </div>
                <button
                  onClick={copyShareLink}
                  className="px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-purple-500/50"
                >
                  {copiedLink ? (
                    <>
                      <Check size={18} className="text-white" />
                      <span className="text-white font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={18} className="text-white" />
                      <span className="text-white font-medium">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="mb-6 text-base font-semibold text-white text-center bg-gradient-to-r from-pink-600/30 to-purple-600/30 border border-purple-400/40 rounded-xl px-4 py-3">
              Share your referral code too — both you and your friend get 50 credits!
            </div>
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-300 mb-3 block">Share via</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors border border-purple-500/30 hover:border-green-400/50 text-white font-medium"
                >
                  WhatsApp
                </button>

                <button
                  onClick={handleShareInstagram}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors border border-purple-500/30 hover:border-pink-500/50 text-white font-medium"
                >
                  Instagram
                </button>

                <button
                  onClick={shareToWeChat}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors border border-purple-500/30 hover:border-green-300/50 text-white font-medium"
                >
                  微信
                </button>

                <button
                  onClick={shareToXHS}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors border border-purple-500/30 hover:border-rose-400/50 text-white font-medium"
                >
                  小红书
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      )}
    </>
  );
};

export default PostDetailPage;
