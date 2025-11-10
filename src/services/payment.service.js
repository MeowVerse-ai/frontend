import api from './api';

export const paymentService = {
  // Get available credit packages
  getPackages: async () => {
    return await api.get('/payment/packages');
  },

  // Create Stripe checkout session
  createCheckout: async (packageId) => {
    return await api.post('/payment/create-checkout-session', {
      packageId,
    });
  },

  // Get payment session status
  getSessionStatus: async (sessionId) => {
    return await api.get(`/payment/session/${sessionId}`);
  },

  // Get payment history
  getPaymentHistory: async (userId) => {
    return await api.get(`/payment/history/${userId}`);
  },
};