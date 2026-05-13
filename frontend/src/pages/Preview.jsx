import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Printer } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import useStore from '../store/useStore';

import page1 from '../assets/opal website proposal_page-0001.jpg';
import page2 from '../assets/opal website proposal_page-0002.jpg';
import page3 from '../assets/opal website proposal_page-0003.jpg';
import page4 from '../assets/opal website proposal_page-0004.jpg';
import page5 from '../assets/opal website proposal_page-0005.jpg';
import page6 from '../assets/opal website proposal_page-0006.jpg';
import page7 from '../assets/opal website proposal_page-0007.jpg';
import page8 from '../assets/opal website proposal_page-0008.jpg';

const TEMPLATES = [
  { id: 'page1', label: 'Cover Page', bg: page1 },
  { id: 'page2', label: 'Company Overview', bg: page2 },
  { id: 'page3', label: 'Our Approach', bg: page3 },
  { id: 'page4', label: 'Services', bg: page4 },
  { id: 'page5', label: 'Deliverables', bg: page5 },
  { id: 'page6', label: 'Timeline', bg: page6 },
  { id: 'page7', label: 'Pricing', bg: page7 },
  { id: 'page8', label: 'Thank You', bg: page8 }
];

const Preview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const proposals = useStore((state) => state.proposals);
  const proposal = proposals.find(p => p.id === id);
  const previewRef = useRef(null);

  const isLoading = useStore((state) => state.isLoading);

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading proposal...</p></div>;
  }

  if (!isLoading && !proposal) {
    return (
      <div className="flex flex-col items-center justify-center h-full mt-20">
        <p className="text-gray-500 mb-4">Proposal not found.</p>
        <button onClick={() => navigate('/saved')} className="text-brand-600 font-medium hover:underline">Go Back</button>
      </div>
    );
  }

  const handleGeneratePDF = async () => {
    const element = previewRef.current;
    const container = element.querySelector('.proposal-pages-container');
    container.classList.remove('space-y-8');
    
    const opt = {
      margin: 0,
      filename: `${proposal.name.replace(/\s+/g, '_')}_Proposal.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'css', avoid: 'tr' }
    };
    await html2pdf().set(opt).from(element).save();
    
    container.classList.add('space-y-8');
  };
  // Sections replaced by TEMPLATES
  return (
    <div className="max-w-5xl mx-auto pb-12">
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-heading font-bold text-gray-900 text-xl leading-tight">{proposal.name}</h1>
            <p className="text-sm text-gray-500">Preview Mode</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors shadow-sm"
          >
            <Printer size={16} />
            <span>Print</span>
          </button>
          <button 
            onClick={handleGeneratePDF}
            className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium text-sm shadow-md transition-colors"
          >
            <Download size={16} />
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      <div className="bg-gray-200 p-8 rounded-2xl overflow-x-auto flex justify-center shadow-inner">
        <div className="max-w-4xl w-full" ref={previewRef}>
          <div className="proposal-pages-container space-y-8 print:space-y-0">
            {TEMPLATES.map(sec => {
              const box = proposal.boxes?.[sec.id] || { x: 50, y: 150, width: 600, height: 500 };
              return (
                <div key={sec.id} className="proposal-page relative bg-white overflow-hidden group">
                  <img src={sec.bg} alt={sec.label} className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" />
                  
                  <div
                    style={{
                      position: 'absolute',
                      left: box.x,
                      top: box.y,
                      width: box.width,
                      height: box.height,
                    }}
                    className="z-20"
                  >
                    <div className="prose max-w-none font-sans text-gray-800 h-full p-4 overflow-hidden" dangerouslySetInnerHTML={{ __html: proposal.content?.[sec.id] || '' }} />
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
