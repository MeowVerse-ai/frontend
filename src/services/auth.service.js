import api from './api';

export const authService = {
  register: async (email, username, password, invitationCode, referralCode, legalConsent) => {
    const response = await api.post('/auth/register', {
      email,
      username,
      password,
      invitationCode,
      referralCode,
      legalConsent,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  googleOAuth: async (accessToken, invitationCode, referralCode) => {
    const response = await api.post('/auth/oauth/google', {
      accessToken,
      invitationCode,
      referralCode,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
};