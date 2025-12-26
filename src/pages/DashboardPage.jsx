import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generationService } from '../services/generation.service';
import { relayService } from '../services/relay.service';
import Navbar from '../components/layout/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import { Calendar, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { buildReportIssueLink, getFriendlyError } from '../utils/errorHandling';
import api from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [updatingRelayId, setUpdatingRelayId] = useState(null);
  const [activeView, setActiveView] = useState('public'); // public | private
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'OK',
    cancelLabel: 'Cancel',
    showCancel: false,
    onConfirm: null,
    error: null,
  });

  useEffect(() => {
    loadHistory(activeView);
  }, [activeView]);

  const loadHistory = async (visibility = 'public') => {
    try {
      setLoading(true);
      const response = await generationService.getHistory(1, 30, visibility);
      setHistory(response.data.jobs);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
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

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  const openAlert = (title, message, error) => {
    setModalState({
      isOpen: true,
      title,
      message,
      confirmLabel: 'OK',
      cancelLabel: 'Cancel',
      showCancel: false,
      onConfirm: null,
      error,
    });
  };

  const openConfirm = (title, message, onConfirm, error) => {
    setModalState({
      isOpen: true,
      title,
      message,
      confirmLabel: 'Confirm',
      cancelLabel: 'Cancel',
      showCancel: true,
      onConfirm,
      error,
    });
  };

  const handleDeletePost = async (postId) => {
    if (!postId) return;
    try {
      setDeletingPostId(postId);
      await api.delete(`/posts/${postId}`);
      await loadHistory(activeView);
    } catch (err) {
      console.error('Failed to remove post', err);
      const { message } = getFriendlyError(err);
      const raw = err.response?.data?.error || '';
      if (raw.toLowerCase().includes('later relay step')) {
        openAlert('Cannot Unpublish', 'Someone already continued this relay. You can’t unpublish this panel.', err);
      } else {
        openAlert('Failed to Unpublish', message, err);
      }
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleRemoveEntry = async (jobId) => {
    if (!jobId) return;
    try {
      await generationService.hideJob(jobId);
      await loadHistory(activeView);
    } catch (err) {
      console.error('Failed to remove history entry', err);
      const { message } = getFriendlyError(err);
      openAlert('Failed to Remove', message, err);
    }
  };

  const handleImageClick = (job) => {
    if (job.post_id) {
      navigate(`/post/${job.post_id}`);
    }
  };

  const canUpdateRelayGrid = (job) => {
    if (!user) return false;
    if (activeView !== 'public') return false;
    const stepNumber = Number(job.step_number || 0);
    return (
      !!job.relay_session_id &&
      stepNumber === 1 &&
      job.relay_owner_id === user.id
    );
  };

  const handleRelayGridUpdate = async (job, nextSteps) => {
    if (!job.relay_session_id) return;
    const currentSteps = Number(job.relay_max_steps || 6);
    if (currentSteps === nextSteps) return;
    try {
      setUpdatingRelayId(job.relay_session_id);
      await relayService.updateSession(job.relay_session_id, { max_steps: nextSteps });
      await loadHistory(activeView);
    } catch (err) {
      console.error('Failed to update relay grid', err);
      const { message } = getFriendlyError(err);
      openAlert('Update Failed', message, err);
    } finally {
      setUpdatingRelayId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-pink-500/30 blur-3xl rounded-full" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/30 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/20 blur-3xl rounded-full" />
      </div>
      <Navbar />
      
      <div className="pt-28 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="relative inline-flex items-center w-[200px] h-12 bg-white/5 border border-white/25 rounded-full px-2 shadow-lg backdrop-blur-lg overflow-hidden">
              <button
                onClick={() => setActiveView('public')}
                className={`relative z-10 flex-1 px-0 py-2 rounded-full font-semibold leading-none text-center transition-colors ${
                  activeView === 'public' ? 'text-slate-900' : 'text-white/80'
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setActiveView('private')}
                className={`relative z-10 flex-1 px-0 py-2 rounded-full font-semibold leading-none text-center transition-colors ${
                  activeView === 'private' ? 'text-slate-900' : 'text-white/80'
                }`}
              >
                Private
              </button>
              <div
                className="absolute inset-y-1 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 transition-all duration-200 shadow-md"
                style={{
                  width: 'calc(50% - 4px)',
                  transform: activeView === 'public' ? 'translateX(0%)' : 'translateX(100%)',
                  left: '4px',
                }}
              />
            </div>
          </div>

          {loading ? (
            <div className="py-12">
              <LoadingSpinner />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-xl text-gray-400 mb-2">No creations yet</p>
              <p className="text-gray-500">Start creating your first meowment!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
              {history.map((job) => (
                <div
                  key={job.id}
                  className="group relative w-full max-w-[360px] min-w-[220px] overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/60 hover:shadow-xl hover:shadow-purple-500/20 transition cursor-pointer backdrop-blur-xl"
                  onClick={() => handleImageClick(job)}
                  style={{ aspectRatio: '3 / 4' }}
                >
                  {job.thumbnail_url ? (
                    <img
                      src={job.thumbnail_url}
                      alt="Generated"
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center px-4 transition duration-500 group-hover:scale-105">
                      <p className="text-white text-sm text-center">No preview</p>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/60 text-purple-100">
                      {activeView === 'public' ? 'Public' : 'Private'}
                    </span>
                  </div>
                  {canUpdateRelayGrid(job) && (
                    <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/60 px-2 py-1 rounded-full text-[11px] text-white/80">
                      <span className="uppercase tracking-wide text-white/60">Grid</span>
                      <div className="inline-flex items-center rounded-full bg-white/10 p-0.5 border border-white/10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRelayGridUpdate(job, 4);
                          }}
                          disabled={updatingRelayId === job.relay_session_id}
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold transition ${
                            Number(job.relay_max_steps || 6) === 4
                              ? 'bg-white text-slate-900'
                              : 'text-white/80 hover:text-white'
                          }`}
                        >
                          4
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRelayGridUpdate(job, 6);
                          }}
                          disabled={updatingRelayId === job.relay_session_id}
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold transition ${
                            Number(job.relay_max_steps || 6) === 6
                              ? 'bg-white text-slate-900'
                              : 'text-white/80 hover:text-white'
                          }`}
                        >
                          6
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1">
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col gap-2">
                    {activeView === 'private' || !job.post_id || job.moderation_status === 'deleted' || job.status === 'failed' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openConfirm(
                            'Remove from Dashboard',
                            'Remove this entry from your dashboard?',
                            () => handleRemoveEntry(job.id)
                          );
                        }}
                        className="flex items-center gap-1 text-red-200 hover:text-red-100 text-xs bg-black/40 px-3 py-1 rounded-full"
                      >
                        <Trash2 size={14} />
                        Remove
                          </button>
                        ) : null}
                        {job.post_id && activeView === 'public' && job.moderation_status !== 'deleted' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openConfirm(
                              'Unpublish Image',
                              'Remove from Public Gallery? It will move to Private.\nOnly if no one continued.',
                              () => handleDeletePost(job.post_id)
                            );
                          }}
                          disabled={deletingPostId === job.post_id}
                          className="flex items-center gap-1 text-red-200 hover:text-red-100 text-xs bg-black/40 px-3 py-1 rounded-full"
                        >
                          <Trash2 size={14} />
                          {deletingPostId === job.post_id ? 'Unpublishing...' : 'Unpublish (move to Private)'}
                        </button>
                        ) : null}
                      </div>
                      <div className="flex items-center text-xs text-white/80 bg-black/50 px-3 py-1 rounded-full">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(job.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
    <Modal isOpen={modalState.isOpen} onClose={closeModal} title={modalState.title} size="sm">
      <p className="text-white/90 text-sm whitespace-pre-line">{modalState.message}</p>
      <div className="mt-6 flex justify-end gap-3">
        {modalState.error && (
          <a
            href={buildReportIssueLink(modalState.error, user?.id)}
            className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
          >
            Report issue
          </a>
        )}
        {modalState.showCancel && (
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
          >
            {modalState.cancelLabel}
          </button>
        )}
        <button
          onClick={async () => {
            const confirmAction = modalState.onConfirm;
            closeModal();
            if (typeof confirmAction === 'function') {
              await confirmAction();
            }
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow"
        >
          {modalState.confirmLabel}
        </button>
      </div>
    </Modal>
  </div>
  );
};

export default DashboardPage;
