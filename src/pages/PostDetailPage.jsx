import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Eye, Share2, Flag, ArrowLeftToLine } from 'lucide-react';
import { postsService } from '../services/posts.service';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CommentsList from '../components/social/CommentsList';
import { formatNumber, formatDate } from '../utils/helpers';

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    setLoading(true);
    try {
      console.log('🔍 Loading post ID:', postId);
      const response = await postsService.getById(postId);
      console.log('✅ Post response:', response);
      setPost(response.data);
    } catch (error) {
      console.error('❌ Failed to load post:', error);
      console.error('Error response:', error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
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
    if (!comment.trim()) return;

    try {
      await postsService.addComment(post.id, comment);
      setComment('');
      loadPost();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleCommentAdded = async () => {
    // Reload post to update comment count
    await loadPost();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftToLine size={24} />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Content */}
          <div className="lg:col-span-2">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl blur-xl opacity-75"></div>
              <div className="relative bg-slate-900/80 rounded-3xl overflow-hidden">
                {post.original_url?.match(/\.(mp4|webm|mov)$/i) ? (
                  <div className="p-3 bg-slate-900/80">
                    <video
                      src={`http://localhost:3000${post.original_url}`}
                      className="w-full h-auto object-contain max-h-[80vh] rounded-2xl"
                      loop
                      autoPlay
                      muted
                      playsInline
                    />
                  </div>
                ) : (
                  <img
                    src={`http://localhost:3000${post.original_url}`}
                    alt={post.title}
                    className="w-full h-auto object-contain max-h-[80vh]"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right: Details & Comments */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-6 sticky top-8">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-purple-500/20">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  {post.username?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-bold text-white">@{post.username}</p>
                  <p className="text-sm text-gray-400">{formatDate(post.created_at)}</p>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-3">{post.title}</h1>
                {post.description && (
                  <p className="text-gray-300 leading-relaxed">{post.description}</p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-purple-500/20">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                    post.is_liked
                      ? 'bg-pink-500/20 text-pink-400'
                      : 'bg-slate-700/50 text-gray-400 hover:text-pink-400'
                  }`}
                >
                  <Heart size={20} fill={post.is_liked ? 'currentColor' : 'none'} />
                  <span className="font-semibold">{formatNumber(post.likes_count || 0)}</span>
                </button>
                <div className="flex items-center space-x-2 text-gray-400">
                  <MessageCircle size={20} />
                  <span>{formatNumber(post.comments_count || 0)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Eye size={20} />
                  <span>{formatNumber(post.views_count || 0)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 mb-6">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl transition-colors">
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
                <button className="flex items-center justify-center px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-gray-400 hover:text-red-400 rounded-xl transition-colors">
                  <Flag size={18} />
                </button>
              </div>

              {/* Comment Form */}
              <form onSubmit={handleComment} className="mb-6">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
                  rows="3"
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                  Post Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="mt-8">
                <CommentsList
                  postId={postId}
                  commentCount={post?.comments_count || 0}
                  onCommentAdded={handleCommentAdded}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;