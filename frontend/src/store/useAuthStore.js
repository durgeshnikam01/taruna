import { create } from 'zustand';
import api from '../services/api';

const getSafeUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

const useAuthStore = create((set) => ({
  user: getSafeUser(),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      set({ 
        user: res.data, 
        token: res.data.token, 
        isAuthenticated: true, 
        loading: false 
      });
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Registration failed', 
        loading: false 
      });
      return false;
    }
  },

  login: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', userData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      set({ 
        user: res.data, 
        token: res.data.token, 
        isAuthenticated: true, 
        loading: false 
      });
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Login failed', 
        loading: false 
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
