import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsService } from '../services/posts.service';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Heart, MessageCircle, Eye, Trash2 } from 'lucide-react';
import { formatNumber, formatDate } from '../utils/helpers';

const MyPostsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyPosts();
  }, []);

  const loadMyPosts = async () => {
    setLoading(true);
    try {
      const response = await postsService.getMyPosts();
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await postsService.deletePost(postId);
      loadMyPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" text="Loading your posts..." />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-6">📭</div>
            <p className="text-2xl text-gray-400 mb-4">No posts yet</p>
            <p className="text-gray-500 mb-8">Start creating amazing meowments!</p>
            <button
              onClick={() => navigate('/generate')}
              className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                
                <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-purple-500/20 group-hover:border-purple-500/50 transition-all">
                  {/* Image */}
                  <div 
                    className="aspect-square relative overflow-hidden bg-slate-900 cursor-pointer"
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    <img
                      src={`http://localhost:3000${post.original_url}`}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Overlay on hover */}
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
                    {/* Date */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-500">
                        {formatDate(post.created_at)}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <Heart size={16} />
                        <span>{formatNumber(post.likes_count || 0)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle size={16} />
                        <span>{formatNumber(post.comments_count || 0)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye size={16} />
                        <span>{formatNumber(post.views_count || 0)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPostsPage;