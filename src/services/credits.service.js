import api from './api';

export const creditsService = {
  // Claim daily credits (Creator tier only)
  claimDaily: async () => {
    return await api.post('/credits/claim-daily');
  },

  // Get credit balance breakdown
  getBalance: async () => {
    return await api.get('/credits/balance');
  },

  // Get credit transaction history
  getHistory: async () => {
    return await api.get('/credits/history');
  },

  // Calculate generation cost
  calculateCost: async (generationType, modelId, options = {}) => {
    return await api.post('/credits/calculate-cost', {
      generationType,
      modelId,
      ...options,
    });
  },

  // Get referral statistics
  getReferralStats: async () => {
    return await api.get('/credits/referral-stats');
  },
};
