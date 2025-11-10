import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { generationService } from '../services/generation.service';
import { creditsService } from '../services/credits.service';
import Navbar from '../components/layout/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Zap, Image as ImageIcon, Calendar, Gift, Crown, Heart } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const DashboardPage = () => {
  const { user, refreshUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [lastClaimed, setLastClaimed] = useState(null);
  const [canClaim, setCanClaim] = useState(false);
  const [likesThisWeek, setLikesThisWeek] = useState(0);

  useEffect(() => {
    loadHistory();
    refreshUser();
    checkDailyCredits();
    loadLikesThisWeek();
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

  const loadLikesThisWeek = async () => {
    try {
      // Calculate date from 7 days ago
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Get user's posts from the last 7 days
      const response = await generationService.getHistory(1, 50);
      const recentJobs = response.data.jobs || [];

      // Filter jobs from last week and sum their likes
      const totalLikes = recentJobs
        .filter(job => new Date(job.created_at) >= weekAgo)
        .reduce((sum, job) => sum + (job.likes_count || 0), 0);

      setLikesThisWeek(totalLikes);
    } catch (error) {
      console.error('Failed to load likes this week:', error);
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

  const stats = [
    {
      icon: Zap,
      label: 'Credits',
      value: user?.credits || 0,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: ImageIcon,
      label: 'Creations',
      value: history.filter(h => h.status === 'completed').length,
      color: 'from-pink-500 to-purple-500',
    },
    {
      icon: Heart,
      label: 'Likes This Week',
      value: likesThisWeek,
      color: 'from-pink-500 to-rose-500',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'processing': return 'text-blue-400 bg-blue-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300`}></div>
                <div className="relative glass-effect rounded-2xl p-8 border border-purple-500/20">
                  <stat.icon className="w-12 h-12 text-pink-400 mb-4" />
                  <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            ))}
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
              <h2 className="text-3xl font-bold text-white mb-6">Recent Creations</h2>

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
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                            <span className="text-sm text-gray-400">
                              {job.model_name}
                            </span>
                          </div>
                          <p className="text-white mb-2 line-clamp-2">{job.prompt}</p>
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