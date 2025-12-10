import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, TrendingUp, Crown, Award, Sparkles } from 'lucide-react';
import { postsService } from '../services/posts.service';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MeowStarsPage = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('week'); // 'week' or 'month'
  const [category, setCategory] = useState('creators'); // 'creators' or 'creations'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [topCreators, setTopCreators] = useState([]);
  const [topCreations, setTopCreations] = useState([]);

  useEffect(() => {
    loadRankings();
  }, [timeframe, category]);

  const loadRankings = async () => {
    setLoading(true);
    setError(null);
    try {
      if (category === 'creators') {
        const response = await postsService.getCreatorRankings(timeframe, 10);
        console.log('📊 Creator Rankings:', response);
        setTopCreators(response.data.creators);
      } else {
        const response = await postsService.getWeeklyRankings();
        console.log('📊 Weekly Rankings:', response);
        setTopCreations(response.data.rankings);
      }
    } catch (err) {
      console.error('Failed to load rankings:', err);
      setError(err.message || 'Failed to load rankings');
    } finally {
      setLoading(false);
    }
  };

  const getMedalColor = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-amber-600 to-amber-800';
    return 'from-purple-400 to-purple-600';
  };

  const getMedalIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6" />;
    if (rank === 2) return <Trophy className="w-6 h-6" />;
    if (rank === 3) return <Award className="w-6 h-6" />;
    return null;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'down') return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
    return <span className="w-4 h-4 text-gray-500">—</span>;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString() || '0';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-5xl sm:text-6xl font-black mb-4 leading-tight">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                MeowStars
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Celebrating our top meowstars
            </p>
          </div>

          {/* Controls */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-slate-800/40 to-purple-900/20 rounded-3xl border border-purple-500/20 shadow-2xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-center sm:items-center">

              {/* Timeframe Toggle */}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setTimeframe('week')}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-xl font-semibold transition-all ${
                    timeframe === 'week'
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setTimeframe('month')}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-xl font-semibold transition-all ${
                    timeframe === 'month'
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  This Month
                </button>
              </div>

              {/* Category Toggle */}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setCategory('creators')}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-xl font-semibold transition-all ${
                    category === 'creators'
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  Creators
                </button>
                <button
                  onClick={() => setCategory('creations')}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-xl font-semibold transition-all ${
                    category === 'creations'
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  Meowstars
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-20">
              <LoadingSpinner size="lg" text="Loading rankings..." />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-red-500/30 max-w-md mx-auto">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-white mb-2">Failed to Load Rankings</h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <button
                  onClick={loadRankings}
                  className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Creators Leaderboard */}
          {!loading && !error && category === 'creators' && (
            <div className="space-y-4">
              {topCreators.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-xl text-gray-400">No creators found for this timeframe</p>
                </div>
              ) : (
                topCreators.map((creator) => (
                  <div
                    key={creator.user_id}
                    onClick={() => navigate(`/profile/${creator.user_id}`)}
                    className="group relative cursor-pointer"
                  >
                    {/* Glow effect */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${getMedalColor(Number(creator.rank))} rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300`}></div>

                    {/* Card content */}
                    <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 group-hover:border-purple-500/40 transition-all">
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="flex-shrink-0">
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getMedalColor(Number(creator.rank))} flex items-center justify-center`}>
                            {getMedalIcon(Number(creator.rank)) || (
                              <span className="text-2xl font-black text-white">#{creator.rank}</span>
                            )}
                          </div>
                        </div>

                        {/* Avatar */}
                        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                          {creator.username ? creator.username.charAt(0).toUpperCase() : 'M'}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-white mb-1">{creator.username}</h3>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span>{formatNumber(creator.total_creations)} creations</span>
                            <span>{formatNumber(creator.total_likes)} likes</span>
                          </div>
                        </div>

                        {/* Trend - placeholder for now */}
                        <div className="flex-shrink-0 hidden sm:flex items-center gap-2">
                          {getTrendIcon('up')}
                        </div>

                        {/* View profile hint */}
                        <div className="flex-shrink-0 hidden group-hover:block">
                          <span className="text-sm text-purple-400 font-semibold">View Profile →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Creations Leaderboard */}
          {!loading && !error && category === 'creations' && (
            <div className="space-y-4">
              {topCreations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-xl text-gray-400">No creations ranked yet this week</p>
                  <p className="text-sm text-gray-500 mt-2">Check back later!</p>
                </div>
              ) : (
                topCreations.map((creation, index) => (
                  <div
                    key={creation.post_id}
                    onClick={() => navigate(`/post/${creation.post_id}`)}
                    className="group relative cursor-pointer"
                  >
                    {/* Glow effect */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${getMedalColor(creation.rank)} rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300`}></div>

                    {/* Card content */}
                    <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 group-hover:border-purple-500/40 transition-all">
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="flex-shrink-0">
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getMedalColor(creation.rank)} flex items-center justify-center`}>
                            {getMedalIcon(creation.rank) || (
                              <span className="text-2xl font-black text-white">#{creation.rank}</span>
                            )}
                          </div>
                        </div>

                        {/* Thumbnail */}
                        {creation.thumbnail_url && (
                          <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-slate-700">
                            <img
                              src={`http://localhost:3000${creation.thumbnail_url}`}
                              alt={creation.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-white mb-1 truncate">{creation.title}</h3>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span>by {creation.username}</span>
                            <span>{formatNumber(creation.score)} points</span>
                          </div>
                        </div>

                        {/* View hint */}
                        <div className="flex-shrink-0 hidden group-hover:block">
                          <span className="text-sm text-purple-400 font-semibold">View Post →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeowStarsPage;
