import api from './api';

export const userService = {
  getProfile: async (username) => {
    const response = await api.get(`/users/${username}`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  getUserPosts: async (username) => {
    const response = await api.get(`/users/${username}/posts`);
    return response.data;
  },

  getCreditBalance: async () => {
    const response = await api.get('/users/credits/balance');
    return response.data;
  },

  getCreditHistory: async () => {
    const response = await api.get('/users/credits/history');
    return response.data;
  },
};
