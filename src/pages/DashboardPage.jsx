import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { generationService } from '../services/generation.service';
import { creditsService } from '../services/credits.service';
import Navbar from '../components/layout/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Calendar, Gift, Crown, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import api from '../services/api';

const DashboardPage = () => {
  const { user, refreshUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [lastClaimed, setLastClaimed] = useState(null);
  const [canClaim, setCanClaim] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);

  useEffect(() => {
    loadHistory();
    refreshUser();
    checkDailyCredits();
  }, []);

  const checkDailyCredits = async () => {
    if (user?.subscription_tier === 'creator') {
      try {
        const response = await creditsService.getBalance();
        const { last_daily_claim, can_claim_today } = response.data;
        setLastClaimed(last_daily_claim);
        setCanClaim(can_claim_today);
      } catch (error) {
        console.error('Failed to check daily credits:', error);
      }
    }
  };

  const loadHistory = async () => {
    try {
      const response = await generationService.getHistory(1, 10);
      setHistory(response.data.jobs);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDaily = async () => {
    setClaiming(true);
    try {
      const response = await creditsService.claimDaily();
      if (response.data.success) {
        setCanClaim(false);
        setLastClaimed(new Date().toISOString());
        await refreshUser();
        alert(`Success! You claimed ${response.data.credits_claimed} daily credits!`);
      }
    } catch (error) {
      console.error('Failed to claim daily credits:', error);
      alert(error.response?.data?.message || 'Failed to claim daily credits');
    } finally {
      setClaiming(false);
    }
  };

  const getDisplayStatus = (job) => {
    if (job.moderation_status === 'deleted') return 'deleted';
    if (job.status === 'failed') return 'failed';
    if (job.visibility === 'public' && job.status === 'completed') return 'published';
    if (job.status === 'completed') return 'completed';
    if (job.status === 'processing' || job.status === 'pending') return 'in progress';
    return job.status || 'unknown';
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

  const getStatusColor = (job) => {
    const status = getDisplayStatus(job);
    switch (status) {
      case 'published': return 'text-green-300 bg-green-400/20';
      case 'completed': return 'text-emerald-300 bg-emerald-500/15';
      case 'in progress': return 'text-blue-300 bg-blue-400/20';
      case 'failed': return 'text-red-300 bg-red-400/20';
      case 'deleted': return 'text-gray-300 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusLabel = (job) => {
    const status = getDisplayStatus(job);
    switch (status) {
      case 'published': return 'Published';
      case 'completed': return 'Completed';
      case 'in progress': return 'In progress';
      case 'failed': return 'Failed';
      case 'deleted': return 'Deleted';
      default: return status;
    }
  };

  const handleDeletePost = async (postId) => {
    if (!postId) return;
    const ok = window.confirm('Remove this from the gallery? This is allowed only before others join your relay.');
    if (!ok) return;
    try {
      setDeletingPostId(postId);
      await api.delete(`/posts/${postId}`);
      await loadHistory();
    } catch (err) {
      console.error('Failed to remove post', err);
      alert(err.response?.data?.error || 'Failed to remove this post.');
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleRemoveEntry = (jobId) => {
    if (!jobId) return;
    const ok = window.confirm('Remove this entry from your dashboard?');
    if (!ok) return;
    setHistory((prev) => prev.filter((job) => job.id !== jobId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="pt-28 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-black gradient-text mb-4 pb-2">
              Meow, {user?.username}!
            </h1>
          </div>

          {/* Daily Credits Claim Card (Creator Tier Only) */}
          {user?.subscription_tier === 'creator' && (
            <div className="relative group mb-12">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 rounded-3xl blur-xl opacity-50"></div>
              <div className="relative glass-effect rounded-3xl p-8 border border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Gift className="w-12 h-12 text-yellow-400" />
                      <Crown className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        Daily Credits
                        <span className="text-yellow-400">Creator Perk</span>
                      </h3>
                      <p className="text-gray-400 mt-1">
                        {canClaim
                          ? 'Claim your 20 daily credits!'
                          : lastClaimed
                            ? `Last claimed: ${formatDate(lastClaimed)}`
                            : 'Already claimed today'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClaimDaily}
                    disabled={!canClaim || claiming}
                    className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                      canClaim && !claiming
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg hover:shadow-yellow-500/50 hover:scale-105'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {claiming ? 'Claiming...' : canClaim ? 'Claim 20 Credits' : 'Claimed Today'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recent Generation History */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative glass-effect rounded-3xl p-8 border border-purple-500/30">
              <h2 className="text-3xl font-bold text-white mb-6">My Relay Runway</h2>

              {loading ? (
                <div className="py-12">
                  <LoadingSpinner />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-xl text-gray-400 mb-4">No creations yet</p>
                  <p className="text-gray-500">Start creating your first meowment!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((job) => (
                    <div
                      key={job.id}
                      className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(job)}`}>
                              {getStatusLabel(job)}
                            </span>
                            {job.visibility && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-purple-200">
                                {job.visibility === 'public' ? 'Public' : 'Private'}
                              </span>
                            )}
                            {job.moderation_status &&
                              job.moderation_status !== 'approved' &&
                              job.moderation_status !== 'deleted' && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-200">
                                {job.moderation_status}
                              </span>
                            )}
                            {job.step_index || job.step_number ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-purple-200">
                                Panel #{job.step_index || job.step_number}
                              </span>
                            ) : null}
                            {/* Model hidden for MVP */}
                          </div>
                          <p className="text-white mb-2 line-clamp-2">
                            {job.prompt_user || stripSystemPrefix(job.prompt)}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {formatDate(job.created_at)}
                            </span>
                            <span>{job.cost_credits} credits</span>
                          </div>
                        </div>
                        {job.thumbnail_url && (
                          <img
                            src={job.thumbnail_url}
                            alt="Generated"
                            className="w-24 h-24 rounded-lg object-cover ml-4"
                          />
                        )}
                        {job.post_id && job.visibility === 'public' && job.moderation_status !== 'deleted' ? (
                          <button
                            onClick={() => handleDeletePost(job.post_id)}
                            disabled={deletingPostId === job.post_id}
                            className="ml-4 flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 text-red-200 hover:bg-red-500/20 transition text-sm"
                          >
                            <Trash2 size={14} />
                            {deletingPostId === job.post_id ? 'Removing...' : 'Delete'}
                          </button>
                        ) : null}
                        {(!job.post_id || job.moderation_status === 'deleted' || job.status === 'failed') ? (
                          <button
                            onClick={() => handleRemoveEntry(job.id)}
                            className="ml-4 flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 text-red-200 hover:bg-red-500/20 transition text-sm"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
