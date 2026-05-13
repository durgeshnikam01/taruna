import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl opacity-50"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden relative z-10"
      >
        <div className="p-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
              <div className="w-5 h-5 bg-white rounded-sm"></div>
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight text-slate-800">Studio</span>
          </div>
          
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
