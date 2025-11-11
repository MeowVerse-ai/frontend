import api from './api';

export const generationService = {
  getModels: async () => {
    // Add cache-busting parameter to force fresh data
    return await api.get('/generation/models', {
      params: { _t: Date.now() }
    });
  },

  generateImage: async (modelId, prompt, negativePrompt, parameters, inputMediaId) => {
    return await api.post('/generation/generate', {
      modelId,
      prompt,
      negativePrompt,
      parameters,
      inputMediaId,
    });
  },

  getJobStatus: async (jobId) => {
    return await api.get(`/generation/jobs/${jobId}`);
  },

  getHistory: async (page = 1, limit = 20) => {
    return await api.get('/generation/history', {
      params: { page, limit },
    });
  },

  cancelJob: async (jobId) => {
    return await api.delete(`/generation/jobs/${jobId}`);
  },
};
