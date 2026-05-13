import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, MoreVertical, Copy, Trash2, Edit, Download, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const SavedProposals = () => {
  const proposals = useStore((state) => state.proposals);
  const deleteProposal = useStore((state) => state.deleteProposal);
  const duplicateProposal = useStore((state) => state.duplicateProposal);
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Saved Proposals</h1>
          <p className="text-gray-500 mt-1">Manage and edit your previously generated proposals.</p>
        </div>
      </header>

      {proposals.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <FileText size={40} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-heading font-bold text-gray-900">No saved proposals</h3>
          <p className="text-gray-500 mt-2 mb-8 max-w-md">You haven't created any proposals yet. Start by selecting a template and filling in the client details.</p>
          <Link 
            to="/create"
            className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5"
          >
            Create Your First Proposal
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map((proposal, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={proposal.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
            >
              {/* Thumbnail Preview Mockup */}
              <div className="h-40 bg-slate-900 p-4 relative overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => navigate(`/editor/${proposal.id}`)}>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-brand-900 opacity-90"></div>
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-500/30 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 w-28 h-36 bg-white rounded shadow-2xl flex flex-col items-center justify-center p-2 transform group-hover:scale-105 transition-transform duration-500">
                  <div className="w-6 h-6 bg-brand-100 rounded-sm mb-2 flex items-center justify-center">
                    <div className="w-3 h-3 bg-brand-500 rounded-sm"></div>
                  </div>
                  <div className="w-16 h-1 bg-gray-200 rounded-full mb-1"></div>
                  <div className="w-12 h-1 bg-gray-200 rounded-full mb-4"></div>
                  <div className="w-20 h-1 bg-gray-100 rounded-full mb-0.5"></div>
                  <div className="w-18 h-1 bg-gray-100 rounded-full mb-0.5"></div>
                  <div className="w-16 h-1 bg-gray-100 rounded-full"></div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-heading font-bold text-gray-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
                      {proposal.name}
                    </h3>
                    <p className="text-sm text-gray-500">{proposal.clientName}</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 text-xs font-medium px-2 py-1 rounded-md shrink-0">Draft</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-2 mb-6">
                  <Clock size={14} />
                  <span>Updated {new Date(proposal.updatedAt).toLocaleDateString()}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button 
                    onClick={() => navigate(`/editor/${proposal.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 py-2 rounded-lg transition-colors mr-2"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => duplicateProposal(proposal.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this proposal?')) {
                          deleteProposal(proposal.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProposals;
