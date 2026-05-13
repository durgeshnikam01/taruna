import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const success = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password
    });
    if (success) {
      navigate('/');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Create Account</h1>
        <p className="text-slate-500">Join Studio and start creating proposals</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 pl-1">Full Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
              <User size={18} />
            </div>
            <input
              {...register('name', { required: 'Name is required' })}
              type="text"
              className={`w-full bg-slate-50 border ${errors.name ? 'border-rose-300' : 'border-slate-200'} rounded-2xl py-3 pl-11 pr-4 outline-none focus:bg-white focus:border-brand-500 transition-all text-slate-700`}
              placeholder="Your Full Name"
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-rose-500 pl-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 pl-1">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
              <Mail size={18} />
            </div>
            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              className={`w-full bg-slate-50 border ${errors.email ? 'border-rose-300' : 'border-slate-200'} rounded-2xl py-3 pl-11 pr-4 outline-none focus:bg-white focus:border-brand-500 transition-all text-slate-700`}
              placeholder="name@company.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-rose-500 pl-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 pl-1">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
              <Lock size={18} />
            </div>
            <input
              {...register('password', { 
                required: 'Password is required',
                minlength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              type="password"
              className={`w-full bg-slate-50 border ${errors.password ? 'border-rose-300' : 'border-slate-200'} rounded-2xl py-3 pl-11 pr-4 outline-none focus:bg-white focus:border-brand-500 transition-all text-slate-700`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="mt-1 text-xs text-rose-500 pl-1">{errors.password.message}</p>}
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] mt-4"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Get Started</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-slate-500 text-sm">
        Already have an account?{' '}
        <Link 
          to="/login" 
          onClick={clearError}
          className="font-bold text-slate-900 hover:text-brand-600 transition-colors"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default Register;
