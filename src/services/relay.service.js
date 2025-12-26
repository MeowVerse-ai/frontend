import api from './api';

export const relayService = {
  createSession: async (payload = {}) => {
    return await api.post('/relay/sessions', payload);
  },

  listSessions: async () => {
    return await api.get('/relay/sessions');
  },

  getSession: async (sessionId) => {
    return await api.get(`/relay/sessions/${sessionId}`);
  },

  addStep: async (sessionId, payload) => {
    return await api.post(`/relay/sessions/${sessionId}/steps`, payload);
  },

  createDraft: async (sessionId, payload) => {
    return await api.post(`/relay/sessions/${sessionId}/drafts`, payload);
  },

  publishDraft: async (sessionId, draftId, payload) => {
    return await api.post(`/relay/sessions/${sessionId}/drafts/${draftId}/publish`, payload);
  },

  deleteDraft: async (draftId) => {
    return await api.delete(`/relay/drafts/${draftId}`);
  },

  closeSession: async (sessionId) => {
    return await api.post(`/relay/sessions/${sessionId}/close`);
  },

  updateSession: async (sessionId, payload = {}) => {
    return await api.patch(`/relay/sessions/${sessionId}`, payload);
  },
};
