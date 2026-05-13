import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusCircle, Bookmark, Settings, LogOut, Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const Layout = () => {
  const location = useLocation();
  const fetchProposals = useStore(state => state.fetchProposals);
  const isEditor = location.pathname.includes('/editor') || location.pathname.includes('/preview');

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Templates', path: '/templates', icon: <FileText size={20} /> },
    { name: 'Create Proposal', path: '/create', icon: <PlusCircle size={20} /> },
    { name: 'Saved Proposals', path: '/saved', icon: <Bookmark size={20} /> },
  ];

  if (isEditor) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans selection:bg-brand-200 selection:text-brand-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-10 shadow-sm relative">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
            <Hexagon size={24} fill="currentColor" strokeWidth={1} />
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl text-gray-900 tracking-tight leading-none">Proposal</h1>
            <p className="text-brand-600 font-medium text-sm">Studio</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? 'text-brand-700 font-medium bg-brand-50' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-brand-50 rounded-xl"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <NavLink
            to="/login"
            className="flex items-center gap-3 px-4 py-3 text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>
        <div className="p-8 max-w-7xl mx-auto relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
