import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  TrendingUp, 
  Users, 
  Clock,
  ArrowRight,
  MoreVertical,
  Download,
  Trash2,
  Copy
} from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import useProposalStore from '../store/useProposalStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { proposals, fetchProposals, deleteProposal, duplicateProposal, loading } = useProposalStore();

  useEffect(() => {
    fetchProposals();
  }, []);

  const stats = [
    { name: 'Total Proposals', value: proposals.length, icon: FileText, color: 'bg-blue-500' },
    { name: 'Active Projects', value: proposals.length > 0 ? Math.ceil(proposals.length * 0.8) : 0, icon: TrendingUp, color: 'bg-emerald-500' },
    { name: 'Total Clients', value: [...new Set(proposals.map(p => p.companyName))].length, icon: Users, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-1">
            Hello, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-slate-500">Welcome back to your proposal workspace.</p>
        </div>
        <Link
          to="/create"
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Plus size={20} />
          <span>New Proposal</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-brand-100 transition-colors">
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-inherit/20`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Proposals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold text-slate-900">Recent Proposals</h2>
          <Link to="/proposals" className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group transition-all">
            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : proposals.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <FileText size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Proposals Yet</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Start creating professional proposals in minutes with our templates.</p>
            <Link to="/create" className="text-brand-600 font-bold border-2 border-brand-600 px-6 py-2 rounded-xl hover:bg-brand-600 hover:text-white transition-all">
              Create First Proposal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.slice(0, 3).map((proposal) => (
              <motion.div
                key={proposal._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:border-brand-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all"
              >
                <div className="h-40 bg-slate-900 relative p-6 overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <div className="relative z-10 flex flex-col justify-end h-full">
                    <span className="text-xs font-bold text-brand-300 uppercase tracking-widest mb-1">{proposal.projectType}</span>
                    <h3 className="text-lg font-bold text-white truncate">{proposal.proposalTitle}</h3>
                  </div>
                  {/* Decorative background for card header */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Client</p>
                      <p className="text-sm font-bold text-slate-800">{proposal.companyName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <Clock size={14} />
                      <span>{new Date(proposal.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => deleteProposal(proposal._id)}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <Link 
                        to={`/editor/${proposal._id}`}
                        className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
