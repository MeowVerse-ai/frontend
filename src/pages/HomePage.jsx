import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Eye, Sparkles, Camera, Zap, Clock, TrendingUp, Star } from 'lucide-react';
import { postsService } from '../services/posts.service';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatNumber, formatDate } from '../utils/helpers';
import { useLocation } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeFilter, setActiveFilter] = useState('latest');
  const location = useLocation();

	useEffect(() => {
    // Check if we need to scroll to MeowMoments
    if (location.state?.scrollTo === 'meowmoments') {
        setTimeout(() => {
        const section = document.getElementById('meowmoments-section');
        section?.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Small delay to ensure page is loaded
    }
	}, [location]);

  useEffect(() => {
    loadPosts();
  }, [activeFilter]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      let response;

      // Call appropriate API based on active filter
      switch (activeFilter) {
        case 'trending':
          response = await postsService.getPopular(1, 12);
          break;
        case 'popular':
          response = await postsService.getPopular(1, 12);
          break;
        case 'latest':
        default:
          response = await postsService.getLatest(1, 12);
          break;
      }

      console.log('API Response:', response); // Debug log

      // Handle different response structures
      const postsData = response?.data?.posts || response?.posts || [];
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMeowment = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      navigate('/studio');
    }, 800);
  };

  const handleLike = async (postId, e) => {
    e.stopPropagation();
    try {
      await postsService.likePost(postId);
      loadPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Original Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pt-16 pb-4">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Title */}
          <div className="mb-10">
            <div className="flex justify-center mb-6">
            </div>
            <h1 className="text-5xl sm:text-8xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Capture Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Meowments
              </span>
            </h1>
            <p className="text-lg sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform ordinary moments into extraordinary memories ✨
            </p>
          </div>

          {/* CTA Card */}
          <div className="max-w-2xl mx-auto mb-8 sm:mb-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600/10 via-purple-600/30 to-blue-600/10 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-pink-800/30 to-purple-800/50 backdrop-blur-xl rounded-3xl pt-8 pb-6 px-6 sm:pt-12 sm:pb-10 sm:px-10 border border-purple-500/30">
                <div className="flex flex-col items-center">
                  <div className="text-6xl sm:text-6xl mb-4 animate-float">🐾</div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
                    Ready to create magic?
                  </h2>
                  
                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button
                      onClick={handleGenerateMeowment}
                      disabled={generating}
                      className="group/btn relative inline-flex items-center justify-center space-x-2 px-6 sm:px-6 py-3 sm:py-3 rounded-2xl text-lg sm:text-lg font-bold overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600/50 via-purple-600/50 to-blue-600/50"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                      <div className="relative flex items-center space-x-3 text-white">
                        {generating ? (
                          <>
                            <Sparkles className="animate-spin" size={28} />
                            <span>Creating Magic...</span>
                          </>
                        ) : (
                          <>
                            <Camera size={26} />
                            <span>Make Meowments</span>
                          </>
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        const section = document.getElementById('meowmoments-section');
                        section?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="group/discover relative inline-flex items-center justify-center space-x-2 px-6 sm:px-6 py-3 sm:py-3 rounded-2xl text-lg sm:text-lg font-bold overflow-hidden transition-all hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 via-pink-600/50 to-blue-600/50"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover/discover:opacity-100 transition-opacity"></div>
                      <div className="relative flex items-center space-x-3 text-white">
                        <Eye size={26} />
                        <span>Discover Meowments</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {[
              { 
                icon: Heart, 
                title: 'Eternal Meowments', 
                desc: 'Turn your cherished moments into eternal meowments', 
                color: 'from-pink-500 to-rose-500' 
              },
              { 
                icon: Zap, 
                title: 'Share and Purr', 
                desc: 'Share your meowments with the community and purr for others', 
                color: 'from-purple-500 to-violet-500' 
              }
            ].map((feature, idx) => (
              <div key={idx} className="group relative">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300`}></div>
                <div className="relative bg-slate-900/40 backdrop-blur-xl rounded-2xl p-5 border border-purple-500/30 group-hover:border-purple-500/40 transition-colors">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                    <feature.icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MeowMoments Section */}
      <div id="meowmoments-section" className="relative pt-24 pb-20 px-4">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto mb-8 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              MeowMoments
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Discover magical creations from our community 🎨
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex justify-center">
            <div className="inline-flex bg-slate-800/10 backdrop-blur-xl font-normal rounded-2xl p-2 border border-purple-500/20">
              {[
                { id: 'latest', label: 'Latest', icon: Clock },
                { id: 'trending', label: 'Trending', icon: TrendingUp },
                { id: 'popular', label: 'Popular', icon: Star }
              ].map((filter) => {
                const Icon = filter.icon;
                const isActive = activeFilter === filter.id;

                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`
                      relative px-4 py-2 rounded-xl text-xsl transition-all duration-300
                      flex items-center space-x-2
                      ${isActive
                        ? 'bg-gradient-to-r from-pink-600/30 via-purple-600/30 to-blue-600/30 text-white/90 shadow-lg shadow-purple-500/50'
                        : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                      }
                    `}
                  >
                    <Icon size={16} className={isActive ? 'animate-pulse' : ''} />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" text="Loading meowments..." />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-7xl mb-6">😿</div>
              <p className="text-2xl text-gray-400 mb-4">No meowments yet</p>
              <p className="text-gray-500 mb-8">Be the first to create something amazing!</p>
              <button
                onClick={() => navigate('/studio')}
                className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-semibold hover:scale-105 transition-transform"
              >
                Create First Meowment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="group relative cursor-pointer"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                  
                  {/* Card */}
                  <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-purple-500/20 group-hover:border-purple-500/50 transition-all">
                    {/* Image and Video*/}
                    <div className="aspect-square relative overflow-hidden bg-slate-900">
                      {post.original_url?.match(/\.(mp4|webm|mov)$/i) ? (
                        <video
                          src={`http://localhost:3000${post.original_url}`}
                          className="w-full h-full object-cover"
                          loop
                          autoPlay
                          muted
                          playsInline
                          onError={(e) => {
                            console.error('❌ Video failed to load!');
                            console.error('Attempted URL:', e.target.src);
                            console.error('Post data:', post);
                          }}
                        />
                      ) : (
                        <img
                          src={`http://localhost:3000${post.original_url || post.thumbnail_url}`}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            console.error('❌ Image failed to load!');
                            console.error('Attempted URL:', e.target.src);
                            console.error('Post data:', post);
                            if (!e.target.src.includes('placeholder')) {
                              e.target.src = 'https://via.placeholder.com/400x400/1e293b/8b5cf6?text=🐱';
                            }
                          }}
                        />
                      )}
                      
                      {/* Overlay with title on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-bold text-lg line-clamp-2">
                            {post.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Post Info */}
                    <div className="p-4">
                      {/* User info */}
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {post.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-300 truncate">
                            @{post.username}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(post.created_at)}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <button
                          onClick={(e) => handleLike(post.id, e)}
                          className={`flex items-center space-x-1 hover:text-pink-400 transition-colors ${
                            post.is_liked ? 'text-pink-400' : ''
                          }`}
                        >
                          <Heart size={16} fill={post.is_liked ? 'currentColor' : 'none'} />
                          <span>{formatNumber(post.likes_count || 0)}</span>
                        </button>
                        <div className="flex items-center space-x-1">
                          <MessageCircle size={16} />
                          <span>{formatNumber(post.comments_count || 0)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye size={16} />
                          <span>{formatNumber(post.views_count || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {!loading && posts.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={loadPosts}
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-semibold transition-colors border border-purple-500/30 hover:border-purple-500/50"
            >
              Load More Meowments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;