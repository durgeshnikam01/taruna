import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, LayoutTemplate } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const Templates = () => {
  const templates = useStore((state) => state.templates);

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-heading font-bold text-gray-900">Proposal Templates</h1>
        <p className="text-gray-500 mt-1">Choose a starting point for your next proposal.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={template.id}
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-brand-500/10 transition-all flex flex-col"
          >
            <div className={`h-32 bg-gradient-to-br ${template.color} p-6 relative overflow-hidden flex items-end`}>
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
              <LayoutTemplate className="absolute top-6 right-6 text-white/40 w-12 h-12" />
              <div className="relative z-10 w-full flex justify-between items-end">
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium">
                  {template.category}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                Professional template with sections for {template.sections.slice(0, 3).join(', ')} and more.
              </p>
              
              <Link
                to={`/create?template=${template.id}`}
                className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-brand-50 text-gray-700 hover:text-brand-600 px-4 py-2.5 rounded-xl font-medium transition-colors border border-gray-100 hover:border-brand-100"
              >
                <span>Use Template</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
