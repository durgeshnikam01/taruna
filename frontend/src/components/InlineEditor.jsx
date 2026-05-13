import React, { useRef, useEffect } from 'react';

const InlineEditor = ({ content, onChange, placeholder = 'Start typing...', className = '' }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (content || '')) {
      editorRef.current.innerHTML = content || '';
    }
  }, []);

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onInput={() => onChange && onChange(editorRef.current.innerHTML)}
      data-placeholder={placeholder}
      className={`outline-none min-h-[100px] prose prose-slate max-w-none p-2 ${className}`}
      style={{ cursor: 'text' }}
    />
  );
};

export default InlineEditor;
