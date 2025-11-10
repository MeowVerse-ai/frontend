import api from './api';

export const postsService = {
  // Get post by ID
  getById: async (postId) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  // Get latest posts
  getLatest: async (page = 1, limit = 20) => {
    const response = await api.get(`/posts/latest?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get current user's posts
  getMyPosts: async (page = 1, limit = 20) => {
    const response = await api.get(`/posts/my-posts?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get popular posts
  getPopular: async (page = 1, limit = 20) => {
    const response = await api.get(`/posts/popular?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get feed (personalized)
  getFeed: async (page = 1, limit = 20) => {
    const response = await api.get(`/posts/feed?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Create post
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Like post
  likePost: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Unlike post
  unlikePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}/like`);
    return response.data;
  },

  // Add comment
  addComment: async (postId, content, parentCommentId = null) => {
    const payload = { content };
    if (parentCommentId) {
      payload.parent_comment_id = parentCommentId;
    }
    const response = await api.post(`/posts/${postId}/comment`, payload);
    return response.data;
  },

  // Get comments
  getComments: async (postId, page = 1, limit = 20) => {
    const response = await api.get(`/posts/${postId}/comments?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/posts/comments/${commentId}`);
    return response.data;
  },

  // Delete post
  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  // Get weekly rankings
  getWeeklyRankings: async (week = null) => {
    const url = week ? `/posts/rankings/weekly?week=${week}` : '/posts/rankings/weekly';
    const response = await api.get(url);
    return response.data;
  },

  // Get creator rankings
  getCreatorRankings: async (timeframe = 'week', limit = 50) => {
    const response = await api.get(`/posts/rankings/creators?timeframe=${timeframe}&limit=${limit}`);
    return response.data;
  },
};