import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Save, Download, ArrowLeft, ChevronLeft, ChevronRight,
  Eye, Loader2, Plus, Bold, Italic, Underline as UnderlineIcon,
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import useProposalStore from '../store/useProposalStore';

// MASTER ASSETS
import coverBg from '../assets/new Gradient Website Project Proposal Document A4 (18)_page-0001.png';
import contentBg from '../assets/new Gradient Website Project Proposal Document A4 (18)_page-0002.png';

const INITIAL_SECTIONS = [
  { id: 'page1', label: 'Cover Page', type: 'cover' },
  { id: 'bodyContent', label: 'Proposal Content', type: 'content' },
];

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProposal, fetchProposalById, updateProposal, loading } = useProposalStore();

  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [content, setContent] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [zoom, setZoom] = useState(0.7);
  const [isSaving, setIsSaving] = useState(false);
  
  const coverRef = useRef(null);
  const bodyRef = useRef(null);
  const previewRef = useRef(null);

  const [bodyPages, setBodyPages] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetchProposalById(id);
      if (data) {
        const sortedKeys = Object.keys(data.content || {})
          .filter(k => k.startsWith('page'))
          .sort((a, b) => {
            const numA = parseInt(a.replace('page', '')) || 0;
            const numB = parseInt(b.replace('page', '')) || 0;
            return numA - numB;
          });

        const frontKey = 'page1';
        const lastKey = sortedKeys.length > 1 ? sortedKeys[sortedKeys.length - 1] : null;
        
        const bodyKeys = sortedKeys.filter(k => k !== frontKey && k !== lastKey);
        
        const initialBodyPages = bodyKeys.map(k => {
          const innerContent = data.content[k];
          return typeof innerContent === 'string' 
            ? innerContent.replace(/margin-top:\s*\d+px/g, 'margin-top: 0px')
            : innerContent;
        });

        setContent({
          page1: data.content?.[frontKey] || '',
          pageLast: lastKey ? data.content?.[lastKey] : ''
        });
        setBodyPages(initialBodyPages.length > 0 ? initialBodyPages : ['']);
      }
    })();
  }, [id]);

  const lastRef = useRef(null);
  const bodyRefs = useRef([]);

  useEffect(() => {
    if (coverRef.current && content.page1 !== undefined) {
      if (coverRef.current.innerHTML !== content.page1) coverRef.current.innerHTML = content.page1;
    }
    if (lastRef.current && content.pageLast !== undefined) {
      if (lastRef.current.innerHTML !== content.pageLast) lastRef.current.innerHTML = content.pageLast;
    }
    
    // Sync body refs
    bodyPages.forEach((pageContent, idx) => {
      if (bodyRefs.current[idx] && bodyRefs.current[idx].innerHTML !== pageContent) {
        bodyRefs.current[idx].innerHTML = pageContent;
      }
    });
  }, [content, bodyPages]);

  const handleInput = (type, index = null) => {
    if (type === 'cover') {
      setContent(prev => ({ ...prev, page1: coverRef.current.innerHTML }));
    } else if (type === 'last') {
      setContent(prev => ({ ...prev, pageLast: lastRef.current.innerHTML }));
    } else if (type === 'body' && index !== null) {
      const newBodyPages = [...bodyPages];
      newBodyPages[index] = bodyRefs.current[index].innerHTML;
      setBodyPages(newBodyPages);
    }
  };

  const handleSave = useCallback(async (exitAfter = false) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      // Re-construct the content object for the database
      const finalContent = {
        page1: content.page1,
      };
      bodyPages.forEach((page, idx) => {
        finalContent[`page${idx + 2}`] = page;
      });
      finalContent[`page${bodyPages.length + 2}`] = content.pageLast;

      await updateProposal(id, { content: finalContent });
      if (exitAfter === true) navigate('/proposals');
    } catch (e) {}
    setIsSaving(false);
  }, [id, content, bodyPages, updateProposal, isSaving, navigate]);

  const handleAddPage = () => {
    setBodyPages(prev => [...prev, '<h2 style="font-size: 24px; font-weight: 800; color: #000;">New Section</h2><p>Start typing your content here...</p>']);
    
    setTimeout(() => {
      const mainCanvas = document.querySelector('.custom-scrollbar');
      if (mainCanvas) {
        mainCanvas.scrollTo({
          top: mainCanvas.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const generatePDF = () => {
    if (!previewRef.current) return;
    setShowPreview(true);
    setTimeout(() => {
      html2pdf().set({
        margin: 0, 
        filename: `${currentProposal?.name || 'proposal'}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          letterRendering: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      }).from(previewRef.current).save().then(() => setShowPreview(false));
    }, 500);
  };

  if (loading && !currentProposal) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  const fmt = (cmd, val = null) => document.execCommand(cmd, false, val);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        
        .cover-typography h1 { 
          font-family: 'Playfair Display', serif;
          color: #1e1b4b; 
          font-weight: 800; 
          text-transform: uppercase; 
          font-size: 56px; 
          line-height: 1.1;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }
        
        .editor-container { 
          width: 210mm; 
          background: #fff; 
          box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25), 0 18px 36px -18px rgba(0, 0, 0, 0.3);
          position: relative; 
          transition: transform 0.2s ease;
        }
        
        .page-marker { 
          position: absolute; 
          left: -80px; 
          width: 70px; 
          text-align: right; 
          color: #94a3b8; 
          font-size: 11px; 
          font-weight: 700; 
          text-transform: uppercase;
          letter-spacing: 0.1em;
          pointer-events: none; 
        }
        
        .flow-content { 
          min-height: 296.5mm; 
          outline: none; 
          padding: 45mm 32mm 45mm; 
          font-family: 'Inter', sans-serif;
          font-size: 15px; 
          line-height: 1.6; 
          color: #1e293b; 
          position: relative; 
          z-index: 10; 
        }

        .flow-content h2 {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          color: #0f172a;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          font-size: 24px;
          letter-spacing: -0.02em;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 0.5rem;
        }

        .flow-content h3 {
          font-weight: 700;
          color: #1e293b;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          font-size: 17px;
        }

        .flow-content p {
          margin-bottom: 0.75rem;
          text-align: justify;
        }

        .flow-content strong {
          color: #0f172a;
          font-weight: 700;
        }

        .flow-content ul, .flow-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.25rem;
        }

        .flow-content li {
          margin-bottom: 0.5rem;
          position: relative;
        }

        .flow-content table {
          border-collapse: separate;
          border-spacing: 0;
          width: 100%;
          margin: 2.5rem 0;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .flow-content th {
          background-color: #f8fafc;
          font-weight: 700;
          padding: 14px 18px;
          text-align: left;
          color: #475569;
          border-bottom: 1px solid #e2e8f0;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.05em;
        }

        .flow-content td {
          padding: 14px 18px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }

        .flow-content tr:last-child td {
          border-bottom: none;
        }

        .page-break-indicator { 
          position: absolute; 
          left: 0; 
          right: 0; 
          height: 0; 
          border-top: 2px dashed #cbd5e1; 
          z-index: 5; 
          pointer-events: none; 
        }

        .proposal-section {
          margin-bottom: 3rem;
          position: relative;
        }
      `}</style>

      {/* Header Toolbar */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-40 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><ArrowLeft size={18} /></button>
          <div className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{currentProposal?.name}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg px-2 py-1">
            <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="p-1 hover:bg-white rounded"><ChevronLeft size={14} /></button>
            <span className="text-xs font-bold text-slate-600 w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="p-1 hover:bg-white rounded"><ChevronRight size={14} /></button>
          </div>
          <button 
            onClick={handleAddPage} 
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span>Add Page</span>
          </button>
          <button onClick={generatePDF} className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-sm font-bold">Download PDF</button>
          <button onClick={() => handleSave(true)} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-bold">Save & Exit</button>
        </div>
      </div>

      {/* Floating Toolbar */}
      <div className="flex justify-center py-2 bg-white border-b border-slate-200">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
          <button onMouseDown={e => { e.preventDefault(); fmt('bold'); }} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><Bold size={18}/></button>
          <button onMouseDown={e => { e.preventDefault(); fmt('italic'); }} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><Italic size={18}/></button>
          <button onMouseDown={e => { e.preventDefault(); fmt('underline'); }} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><UnderlineIcon size={18}/></button>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button onMouseDown={e => { e.preventDefault(); fmt('justifyLeft'); }} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><AlignLeft size={18}/></button>
          <button onMouseDown={e => { e.preventDefault(); fmt('justifyCenter'); }} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><AlignCenter size={18}/></button>
          <button onMouseDown={e => { e.preventDefault(); fmt('justifyRight'); }} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><AlignRight size={18}/></button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 overflow-y-auto p-20 bg-slate-200/50 flex flex-col items-center custom-scrollbar">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
          
          {/* 1. Cover Page Section */}
          <div className="editor-container mb-10" style={{ minHeight: '296.5mm', height: 'auto' }}>
            <img src={coverBg} alt="" className="absolute inset-0 w-full h-full object-cover z-0" />
            <div 
              ref={coverRef}
              contentEditable={!showPreview}
              suppressContentEditableWarning={true}
              onInput={() => handleInput('cover')}
              className="flow-content cover-typography"
              style={{ padding: '50mm 35mm 30mm' }}
            />
          </div>

          {/* 2. Body Pages - Dynamic Array of A4 Pages */}
          {bodyPages.map((pageContent, idx) => {
            const isTightPage = idx === 0 || idx === 4; // Page 2 and Page 6 (5mm)
            const isSpaciousPage = idx === 3 || idx === 5; // Page 5 and Page 7 (25mm)
            const topPadding = isTightPage ? '5mm' : (isSpaciousPage ? '25mm' : '15mm');
            
            return (
              <div key={idx} className="editor-container mb-10" style={{ minHeight: '296.5mm', height: 'auto', position: 'relative' }}>
                <img src={contentBg} alt="" className="absolute inset-0 w-full h-full object-cover z-0" />
                <div className="page-marker" style={{ top: '20mm' }}>PAGE {idx + 2}</div>
                <div 
                  ref={el => bodyRefs.current[idx] = el}
                  contentEditable={!showPreview}
                  suppressContentEditableWarning={true}
                  onInput={() => handleInput('body', idx)}
                  className="flow-content"
                  style={{ 
                    padding: `${topPadding} ${idx === 0 ? '25mm' : '30mm'} 30mm`,
                    fontSize: idx === 0 ? '14.5px' : '15px' // Slightly smaller for Page 2 to ensure fit
                  }}
                />
              </div>
            );
          })}

          {/* 3. Static Last Page Section */}
          <div className="editor-container" style={{ minHeight: '296.5mm', height: 'auto' }}>
            <img src={coverBg} alt="" className="absolute inset-0 w-full h-full object-cover z-0" />
            <div 
              ref={lastRef}
              contentEditable={!showPreview}
              suppressContentEditableWarning={true}
              onInput={() => handleInput('last')}
              className="flow-content"
              style={{ padding: '50mm 35mm 30mm' }}
            />
            <div className="page-marker" style={{ top: '20mm' }}>LAST PAGE</div>
          </div>
        </div>
      </div>

      {/* Hidden PDF Engine - Pixel Perfect Splicing */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={previewRef} style={{ width: '210mm', background: '#fff' }}>
          {/* Page 1 */}
          <div className="pdf-page relative" style={{ width: '210mm', height: '297mm', overflow: 'hidden', backgroundColor: '#fff' }}>
            <img src={coverBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="flow-content cover-typography" style={{ padding: '50mm 35mm 30mm', position: 'relative', zIndex: 10 }} dangerouslySetInnerHTML={{ __html: content.page1 }} />
          </div>
          
          {/* Body Pages */}
          {bodyPages.map((pageHtml, idx) => {
            const isTightPage = idx === 0 || idx === 4; // Page 2 and Page 6 (5mm)
            const isSpaciousPage = idx === 3 || idx === 5; // Page 5 and Page 7 (25mm)
            const topPadding = isTightPage ? '5mm' : (isSpaciousPage ? '25mm' : '15mm');
            
            return (
              <div key={idx} className="pdf-page relative" style={{ width: '210mm', height: '296.5mm', overflow: 'hidden', backgroundColor: '#fff' }}>
                <img src={contentBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="flow-content" style={{ 
                  padding: `${topPadding} ${idx === 0 ? '25mm' : '32mm'} 45mm`, 
                  fontSize: idx === 0 ? '14.5px' : '15px',
                  position: 'relative', 
                  zIndex: 10 
                }} dangerouslySetInnerHTML={{ __html: pageHtml }} />
              </div>
            );
          })}

          {/* Last Page */}
          <div className="pdf-page relative" style={{ width: '210mm', height: '297mm', overflow: 'hidden', backgroundColor: '#fff' }}>
            <img src={coverBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="flow-content cover-typography" style={{ padding: '50mm 35mm 30mm', position: 'relative', zIndex: 10 }} dangerouslySetInnerHTML={{ __html: content.pageLast }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
