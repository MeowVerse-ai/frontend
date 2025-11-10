import api from './api';

export const subscriptionService = {
  // Create Creator tier subscription
  subscribe: async (tier = 'creator') => {
    return await api.post('/subscriptions/subscribe', { tier });
  },

  // Cancel subscription (keeps access until period end)
  cancel: async () => {
    return await api.post('/subscriptions/cancel');
  },

  // Get current subscription status
  getStatus: async () => {
    return await api.get('/subscriptions/status');
  },

  // Get subscription billing history
  getHistory: async () => {
    return await api.get('/subscriptions/history');
  },
};
