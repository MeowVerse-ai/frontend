import api from './api';

export const generationService = {
  getModels: async () => {
    // Add cache-busting parameter to force fresh data
    return await api.get('/generation/models', {
      params: { _t: Date.now() }
    });
  },

  generateImage: async (modelId, prompt, negativePrompt, parameters) => {
    return await api.post('/generation/generate', {
      model_id: modelId,
      prompt,
      negative_prompt: negativePrompt,
      parameters,
    });
  },

  getJobStatus: async (jobId) => {
    return await api.get(`/generation/jobs/${jobId}`);
  },

  getHistory: async (page = 1, limit = 20, visibility) => {
    return await api.get('/generation/history', {
      params: { page, limit, visibility },
    });
  },

  hideJob: async (jobId) => {
    return await api.patch(`/generation/history/${jobId}/hide`);
  },

  cancelJob: async (jobId) => {
    return await api.delete(`/generation/jobs/${jobId}`);
  },
};
