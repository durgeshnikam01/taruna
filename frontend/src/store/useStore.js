import { create } from 'zustand';

const API_URL = 'http://localhost:5000/api/proposals';

const initialTemplates = [
  {
    id: 't1',
    name: 'Website Proposal',
    category: 'Web Development',
    color: 'from-blue-500 to-indigo-600',
    sections: ['Cover Page', 'Executive Summary', 'Scope of Work', 'Timeline', 'Pricing', 'Terms'],
  },
  {
    id: 't2',
    name: 'ERP Proposal',
    category: 'Enterprise Software',
    color: 'from-brand-500 to-purple-600',
    sections: ['Cover Page', 'Executive Summary', 'System Architecture', 'Modules', 'Implementation Plan', 'Pricing', 'Agreement'],
  },
  {
    id: 't3',
    name: 'Mobile App Proposal',
    category: 'Mobile Development',
    color: 'from-emerald-400 to-teal-500',
    sections: ['Cover Page', 'App Features', 'UI/UX Design', 'Development Phases', 'Pricing', 'Maintenance'],
  },
  {
    id: 't4',
    name: 'E-Commerce Proposal',
    category: 'E-Commerce',
    color: 'from-orange-400 to-rose-500',
    sections: ['Cover Page', 'Platform Choice', 'Store Setup', 'Payment Gateway', 'Timeline', 'Pricing'],
  },
];

const useStore = create((set, get) => ({
  proposals: [],
  currentProposal: null,
  templates: initialTemplates,
  isLoading: false,

  fetchProposals: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        // map _id to id for frontend consistency
        const formattedData = data.map(p => ({ ...p, id: p._id }));
        set({ proposals: formattedData, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
      set({ isLoading: false });
    }
  },

  addProposal: async (proposal) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposal),
      });
      if (response.ok) {
        const newProposal = await response.json();
        const formattedProposal = { ...newProposal, id: newProposal._id };
        set((state) => ({
          proposals: [formattedProposal, ...state.proposals],
        }));
        return formattedProposal;
      }
    } catch (error) {
      console.error('Failed to add proposal:', error);
    }
    return null;
  },

  updateProposal: async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        const updatedProposal = await response.json();
        const formattedProposal = { ...updatedProposal, id: updatedProposal._id };
        
        set((state) => ({
          proposals: state.proposals.map((p) =>
            p.id === id ? formattedProposal : p
          ),
          currentProposal: state.currentProposal?.id === id 
            ? formattedProposal
            : state.currentProposal,
        }));
        return formattedProposal;
      }
    } catch (error) {
      console.error('Failed to update proposal:', error);
    }
    return null;
  },

  deleteProposal: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        set((state) => ({
          proposals: state.proposals.filter((p) => p.id !== id),
        }));
      }
    } catch (error) {
      console.error('Failed to delete proposal:', error);
    }
  },

  duplicateProposal: async (id) => {
    try {
      const response = await fetch(`${API_URL}/duplicate/${id}`, {
        method: 'POST',
      });
      if (response.ok) {
        const newProposal = await response.json();
        const formattedProposal = { ...newProposal, id: newProposal._id };
        set((state) => ({
          proposals: [formattedProposal, ...state.proposals],
        }));
        return formattedProposal;
      }
    } catch (error) {
      console.error('Failed to duplicate proposal:', error);
    }
    return null;
  },

  setCurrentProposal: (proposal) => set({ currentProposal: proposal }),
  clearCurrentProposal: () => set({ currentProposal: null }),
}));

export default useStore;
