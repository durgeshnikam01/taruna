import { create } from 'zustand';
import api from '../services/api';

const useProposalStore = create((set, get) => ({
  proposals: [],
  currentProposal: null,
  loading: false,
  error: null,

  fetchProposals: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/proposals');
      set({ proposals: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch proposals', loading: false });
    }
  },

  fetchProposalById: async (id) => {
    set({ loading: true });
    try {
      const res = await api.get(`/proposals/${id}`);
      set({ currentProposal: res.data, loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch proposal', loading: false });
      return null;
    }
  },

  createProposal: async (proposalData) => {
    set({ loading: true });
    try {
      const res = await api.post('/proposals', proposalData);
      set((state) => ({ 
        proposals: [res.data, ...state.proposals],
        loading: false 
      }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to create proposal', loading: false });
      return null;
    }
  },

  updateProposal: async (id, proposalData) => {
    set({ loading: true });
    try {
      const res = await api.put(`/proposals/${id}`, proposalData);
      set((state) => ({
        proposals: state.proposals.map((p) => (p._id === id ? res.data : p)),
        currentProposal: res.data,
        loading: false,
      }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to update proposal', loading: false });
      return null;
    }
  },

  deleteProposal: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`/proposals/${id}`);
      set((state) => ({
        proposals: state.proposals.filter((p) => p._id !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to delete proposal', loading: false });
      return false;
    }
  },

  duplicateProposal: async (id) => {
    set({ loading: true });
    try {
      const res = await api.post(`/proposals/duplicate/${id}`);
      set((state) => ({
        proposals: [res.data, ...state.proposals],
        loading: false,
      }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to duplicate proposal', loading: false });
      return null;
    }
  },

  generateAIContent: async (proposalData) => {
    set({ loading: true });
    try {
      const res = await api.post('/proposals/generate-ai', proposalData);
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'AI Generation failed. Please try again.', loading: false });
      return null;
    }
  },

  generateSummary: async (summaryData) => {
    set({ loading: true });
    try {
      const res = await api.post('/ai/generate-summary', summaryData);
      set({ loading: false });
      return res.data.summary;
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'AI Summary generation failed.', 
        loading: false 
      });
      return null;
    }
  },

  setCurrentProposal: (proposal) => set({ currentProposal: proposal }),
}));

export default useProposalStore;
