import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import CommentItem from './CommentItem';
import LoadingSpinner from '../common/LoadingSpinner';
import { postsService } from '../../services/posts.service';

const CommentsList = ({ postId, commentCount, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async (pageNum = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await postsService.getComments(postId, pageNum, 20);
      console.log('📝 Comments loaded:', response);

      // Build nested comment structure
      const nestedComments = buildCommentTree(response.data.comments);

      if (pageNum === 1) {
        setComments(nestedComments);
      } else {
        setComments(prev => [...prev, ...nestedComments]);
      }

      setHasMore(response.data.pagination?.hasMore || false);
      setPage(pageNum);
      setError(null);
    } catch (err) {
      console.error('Failed to load comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Build nested comment tree from flat list
  const buildCommentTree = (flatComments) => {
    const commentMap = {};
    const rootComments = [];

    // First pass: create map of all comments
    flatComments.forEach(comment => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    // Second pass: build tree structure
    flatComments.forEach(comment => {
      if (comment.parent_comment_id && commentMap[comment.parent_comment_id]) {
        commentMap[comment.parent_comment_id].replies.push(commentMap[comment.id]);
      } else {
        rootComments.push(commentMap[comment.id]);
      }
    });

    return rootComments;
  };

  const handleReply = async (parentCommentId, content) => {
    try {
      const response = await postsService.addComment(postId, content, parentCommentId);
      console.log('✅ Reply added:', response);

      // Reload comments to get the new reply
      await loadComments(1);

      // Notify parent component
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Failed to add reply:', error);
      alert('Failed to post reply. Please try again.');
      throw error;
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await postsService.deleteComment(commentId);
      console.log('🗑️ Comment deleted:', commentId);

      // Reload comments
      await loadComments(1);

      // Notify parent component
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleLoadMore = () => {
    loadComments(page + 1);
  };

  if (loading) {
    return (
      <div className="py-8">
        <LoadingSpinner size="md" text="Loading comments..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-red-500/30">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => loadComments(1)}
            className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No comments yet</p>
        <p className="text-gray-500 text-sm mt-1">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Comments Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          {commentCount > 0 ? `${commentCount} ${commentCount === 1 ? 'Comment' : 'Comments'}` : 'Comments'}
        </h3>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onDelete={handleDelete}
            level={0}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-gray-300 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? 'Loading...' : 'Load More Comments'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
