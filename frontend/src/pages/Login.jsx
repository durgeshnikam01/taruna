import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const success = await login(data);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-slate-500">Sign in to your account to continue</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 pl-1">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
              <Mail size={18} />
            </div>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              className={`w-full bg-slate-50 border ${errors.email ? 'border-rose-300' : 'border-slate-200'} rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-slate-700`}
              placeholder="name@company.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-rose-500 pl-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2 pl-1">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <a href="#" className="text-xs font-semibold text-brand-600 hover:text-brand-700">Forgot Password?</a>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
              <Lock size={18} />
            </div>
            <input
              {...register('password', { required: 'Password is required' })}
              type="password"
              className={`w-full bg-slate-50 border ${errors.password ? 'border-rose-300' : 'border-slate-200'} rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-slate-700`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="mt-1 text-xs text-rose-500 pl-1">{errors.password.message}</p>}
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <p className="mt-10 text-center text-slate-500 text-sm">
        Don't have an account?{' '}
        <Link 
          to="/register" 
          onClick={clearError}
          className="font-bold text-slate-900 hover:text-brand-600 transition-colors"
        >
          Create Account
        </Link>
      </p>
    </div>
  );
};

export default Login;
