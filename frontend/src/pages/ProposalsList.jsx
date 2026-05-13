import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Search, 
  Filter, 
  MoreVertical,
  Download,
  Trash2,
  Copy,
  Edit2,
  ExternalLink,
  Loader2,
  Clock,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useProposalStore from '../store/useProposalStore';

const ProposalsList = () => {
  const { proposals, fetchProposals, deleteProposal, duplicateProposal, loading } = useProposalStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchProposals();
  }, []);

  const filteredProposals = proposals.filter(p => {
    const matchesSearch = p.proposalTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || p.templateId === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-1">My Proposals</h1>
          <p className="text-slate-500">Manage and track all your professional proposals.</p>
        </div>
        <Link
          to="/create"
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5"
        >
          <Plus size={20} />
          <span>New Proposal</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title or company..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-slate-600 placeholder:text-slate-400"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-brand-500 transition-all cursor-pointer"
            >
              <option value="all">All Templates</option>
              <option value="website">Website</option>
              <option value="erp">ERP Software</option>
              <option value="crm">CRM System</option>
              <option value="mobile">Mobile App</option>
              <option value="ecommerce">E-Commerce</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          
          <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-100 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Table/List View */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        {loading && proposals.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
            <p className="text-slate-500 font-medium">Fetching your proposals...</p>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
              <FileText size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Proposals Found</h3>
            <p className="text-slate-500 max-w-sm">Try adjusting your search or filters, or create a new proposal from scratch.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Proposal Details</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Updated</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProposals.map((proposal) => (
                  <motion.tr 
                    key={proposal._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-brand-400 font-bold text-xs border border-slate-800 shadow-inner overflow-hidden relative">
                           {proposal.templateId?.substring(0, 1).toUpperCase() || 'P'}
                           <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 mb-0.5 truncate max-w-[240px]">{proposal.proposalTitle}</p>
                          <p className="text-[11px] font-bold text-brand-600 uppercase tracking-widest">{proposal.projectType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
                          <UserIcon size={14} />
                        </div>
                        <span className="text-sm font-medium text-slate-600">{proposal.companyName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {new Date(proposal.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/editor/${proposal._id}`}
                          className="p-2 text-slate-400 hover:text-brand-600 transition-colors rounded-lg hover:bg-brand-50"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => duplicateProposal(proposal._id)}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                          title="Duplicate"
                        >
                          <Copy size={18} />
                        </button>
                        <button 
                          onClick={() => deleteProposal(proposal._id)}
                          className="p-2 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalsList;
