import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles,
  ArrowRight, 
  ArrowLeft, 
  Layout, 
  Briefcase, 
  Globe, 
  Smartphone, 
  ShoppingCart, 
  Cpu,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import useProposalStore from '../store/useProposalStore';

const templates = [
  { id: 'website', name: 'Website Proposal', icon: Globe, color: 'bg-blue-500', category: 'Digital Presence' },
  { id: 'erp', name: 'ERP Software', icon: Briefcase, color: 'bg-emerald-500', category: 'Enterprise' },
  { id: 'crm', name: 'CRM System', icon: Cpu, color: 'bg-indigo-500', category: 'Management' },
  { id: 'mobile', name: 'Mobile Application', icon: Smartphone, color: 'bg-rose-500', category: 'Development' },
  { id: 'ecommerce', name: 'E-Commerce Store', icon: ShoppingCart, color: 'bg-amber-500', category: 'Retail' },
  { id: 'custom', name: 'Custom Solution', icon: Layout, color: 'bg-purple-500', category: 'Software' },
];

const DEFAULT_TEMPLATES = {
  uniqueExecutiveSummary: (cName) => `The objective of the website development is to create a modern, elegant, and high-converting digital platform for <strong>${cName}</strong> that effectively showcases its expertise in advanced skincare, beauty treatments, and cosmetic procedures. The website will be designed to build trust, attract, and convert potential clients.\n\nThe platform will highlight <strong>${cName}</strong>'s comprehensive range of aesthetic and cosmetic treatments, advanced skincare solutions, and expertise in enhancing natural beauty. It will showcase the clinic's commitment to innovation, safety, and personalized care, while clearly communicating its vision, values, and dedication to delivering confidence through world-class aesthetic services.\n\nThrough a clean, elegant design, intuitive navigation, and visually compelling elements, the website will position <strong>${cName}</strong> as a trusted and premium destination for skincare, cosmetic procedures, and holistic beauty treatments.`,
  uniqueScopeOfWork: (cName) => `Our core objective is to position <strong>${cName}</strong> as a trusted and forward-thinking aesthetic and cosmetic clinic, recognized for excellence, safety, and innovation in advanced skincare and beauty treatments.`,
  websiteStructure: `Home Page Content\nAbout Us\nOUR Services\nOur EXPERTISE\nWhy Choose Us\nContact Page Content`,
  design: `Custom design aligned with brand identity\nResponsive design for mobile, tablet, and desktop\nCross-browser compatibility (Chrome, Safari, Firefox, Edge)`,
  development: `Built using HTML5, CSS3, JavaScript\nBasic SEO optimization (meta tags, keywords, alt tags)\nContact form with email integration (Formspree/EmailJS)\nGoogle Maps integration\nOptimized for fast loading`,
  uniquePricingBreakdown: `Static Website Development | ₹15,000\nDomain | ₹2000\nServer | ₹5000\nSSL Certificate | ₹3000\nWhatsApp Integration | ₹3000\nUI/UX Design (Upto 5 Pages) | ₹6,000\nSEO Setup | ₹3000\nSpeed and Optimization | ₹3,000\nContact Form With Mail Integration | ₹5,000`,
  whatYouGet: `Fully developed, professional website.\nDomain & hosting setup (1st year included)\nSecure HTTPS connection\nInstagram & WhatsApp integration\nOptimized for mobile and fast loading\nBasic SEO setup to help you appear on search engines\nSmooth gallery to showcase your work\nEnquiry/booking form\nNo hidden charges – fully transparent package`,
  timelineDetail: `Phase 1: Research & Discovery (Day 1-2)\nPhase 2: UI/UX Design & Branding (Day 3-5)\nPhase 3: Core Development & Integration (Day 6-8)\nPhase 4: Testing, SEO & Deployment (Day 9-10)`,
  support: `7 Days Free Post-Launch Support\nSecurity Monitoring & SSL Management\nBasic Training for Content Management\nWhatsApp & Email Technical Assistance`,
  termsConditions: `The project includes a static website with up to 5 to 8 pages.\nProject timeline is specified from the date of 60% advance payment and complete content submission.\nDelay in content or approvals from the client will extend the delivery timeline.\nThe client must provide all text, images, logo, and contact details within 3 working days.\nThe total project cost is specified (all inclusive).\n60% advance payment is required to start the project.\nThe remaining 40% must be paid before final deployment.\nAll payments made are non-refundable.\nDomain registration is included for 1 year.\nWeb hosting is included for 1 year.\nSSL certificate worth ₹3,000 is included for 1 year.\nRenewal charges for domain, hosting, and SSL will apply from the second year onward.\nWhatsApp integration is included in the website.\nThe website will be fully responsive for mobile, tablet, and desktop.\nBasic SEO setup is included (meta tags, titles, and descriptions).\nAfter deployment, the client will receive full access credentials.\n7 days of free technical support is included after launch.\nOngoing maintenance, updates, or content changes are not included.\nAfter final payment, full ownership of the website is transferred to the client.\nAll client data will remain confidential and will not be shared with third parties.\nIf the client cancels the project after starting, the advance payment is non-refundable.\nAny partial work done until cancellation will be billed accordingly.`
};

const CreateProposal = () => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [localError, setLocalError] = useState(null);
  const { createProposal, generateAIContent, generateSummary, loading, error: storeError } = useProposalStore();
  const navigate = useNavigate();
  const { register, handleSubmit, getValues, setValue, control, formState: { errors } } = useForm({
    defaultValues: {
      websiteStructure: ['Home Page Content', 'About Us', 'OUR Services', 'Our EXPERTISE', 'Why Choose Us', 'Contact Page Content']
    }
  });

  const [structureFields, setStructureFields] = useState(['Home Page Content', 'About Us', 'OUR Services', 'Our EXPERTISE', 'Why Choose Us', 'Contact Page Content']);

  const addStructureField = () => setStructureFields([...structureFields, '']);
  const removeStructureField = (index) => {
    if (structureFields.length > 1) {
      const newFields = structureFields.filter((_, i) => i !== index);
      setStructureFields(newFields);
    }
  };
  const handleStructureChange = (index, value) => {
    const newFields = [...structureFields];
    newFields[index] = value;
    setStructureFields(newFields);
    setValue('websiteStructure', newFields);
  };

  const handleStandardSubmit = async (data) => {
    setLocalError(null);
    if (!selectedTemplate) { setLocalError('Please select a template first'); return; }
    try {
      const content = generateInitialData(selectedTemplate.id, { ...data, websiteStructure: structureFields });
      const proposalData = {
        ...data,
        websiteStructure: structureFields,
        templateId: selectedTemplate.id,
        projectType: selectedTemplate.name,
        templateType: 'image',
        content,
        boxes: {},
        pages: [
          { id: 'page1', label: 'Cover Page' },
          { id: 'page2', label: 'Executive Summary' },
          { id: 'page3', label: 'Scope of Work' },
          { id: 'page4', label: 'Investment & Pricing' },
          { id: 'page5', label: 'Timeline' },
          { id: 'page6', label: 'Terms & Conditions' },
          { id: 'page7', label: 'About Us' },
          { id: 'page8', label: 'Thank You' },
        ]
      };
      const newProposal = await createProposal(proposalData);
      if (newProposal) {
        navigate(`/editor/${newProposal._id}`);
      }
    } catch (err) {
      setLocalError(err.message || 'An unexpected error occurred');
    }
  };

  const handleAiSubmit = async () => {
    const data = getValues();
    if (!selectedTemplate || !data.name || !data.proposalTitle || !data.clientName || !data.companyName) {
      alert('Please fill in all required fields first');
      return;
    }

    setIsAiGenerating(true);
    const aiData = await generateAIContent({
      ...data,
      websiteStructure: structureFields,
      projectType: selectedTemplate.name,
    });

    if (aiData) {
      const proposalData = {
        ...data,
        websiteStructure: structureFields,
        templateId: selectedTemplate.id,
        projectType: selectedTemplate.name,
        templateType: 'image',
        content: aiData.content,
        boxes: {},
        pages: [
          { id: 'page1', label: 'Cover Page' },
          { id: 'page2', label: 'Executive Summary' },
          { id: 'page3', label: 'Scope of Work' },
          { id: 'page4', label: 'Investment & Pricing' },
          { id: 'page5', label: 'Timeline' },
          { id: 'page6', label: 'Terms & Conditions' },
          { id: 'page7', label: 'About Us' },
          { id: 'page8', label: 'Thank You' }
        ]
      };

      const newProposal = await createProposal(proposalData);
      if (newProposal) {
        navigate(`/editor/${newProposal._id}`);
      } else {
        setLocalError('Could not create AI proposal. Please check connection.');
      }
    }
    setIsAiGenerating(false);
  };

  const generateInitialData = (templateId, data) => {
    const content = {};
    const cName = data.companyName || 'CLIENT NAME';
    const price = data.projectPrice || '45,000';
    const dPrice = data.discountedPrice || '35,000';
    const time = data.timeline || '7-10 working days';

     const execSummary = (data.uniqueExecutiveSummary || data.executiveSummary) ? 
      `<p style="font-size: 15px; line-height: 1.6; color: #222; margin-bottom: 20px;">${(data.uniqueExecutiveSummary || data.executiveSummary).replace(/\n/g, '<br/>')}</p>` :
      `<p style="font-size: 15px; line-height: 1.6; color: #222; margin-bottom: 20px;">The objective of the website development is to create a modern, elegant, and high-converting digital platform for <strong>${cName}</strong> that effectively showcases its expertise in advanced skincare, beauty treatments, and cosmetic procedures. The website will be designed to build trust, attract, and convert potential clients.</p>
      <p style="font-size: 15px; line-height: 1.6; color: #222; margin-bottom: 20px;">The platform will highlight <strong>${cName}</strong>'s comprehensive range of aesthetic and cosmetic treatments, advanced skincare solutions, and expertise in enhancing natural beauty. It will showcase the clinic's commitment to innovation, safety, and personalized care, while clearly communicating its vision, values, and dedication to delivering confidence through world-class aesthetic services.</p>
      <p style="font-size: 15px; line-height: 1.6; color: #222; margin-bottom: 25px;">Through a clean, elegant design, intuitive navigation, and visually compelling elements, the website will position <strong>${cName}</strong> as a trusted and premium destination for skincare, cosmetic procedures, and holistic beauty treatments.</p>`;

    const scope = (data.uniqueScopeOfWork || data.scopeOfWork) ?
      `<p style="font-size: 16px; line-height: 1.6; color: #222; margin-bottom: 40px; max-width: 90%;">${(data.uniqueScopeOfWork || data.scopeOfWork).replace(/\n/g, '<br/>')}</p>` :
      `<p style="font-size: 16px; line-height: 1.6; color: #222; margin-bottom: 40px; max-width: 90%;">Our core objective is to position <strong>${cName}</strong> as a trusted and forward-thinking aesthetic and cosmetic clinic, recognized for excellence, safety, and innovation in advanced skincare and beauty treatments.</p>`;

    const structure = (Array.isArray(data.websiteStructure) ? data.websiteStructure : (data.websiteStructure || '')).length > 0 ?
      `<ul style="font-size: 15px; line-height: 1.6; color: #000; margin-left: 20px; margin-bottom: 20px; list-style-type: disc;">${(Array.isArray(data.websiteStructure) ? data.websiteStructure : data.websiteStructure.split('\n')).map(item => `<li>${item.trim()}</li>`).join('')}</ul>` :
      `<ul style="font-size: 15px; line-height: 1.6; color: #000; margin-left: 20px; margin-bottom: 20px; list-style-type: disc;">
        <li>Home Page Content</li>
        <li>About Us</li>
        <li>OUR Services</li>
        <li>Our EXPERTISE</li>
        <li>Why Choose Us</li>
        <li>Contact Page Content</li>
      </ul>`;

    const designList = data.design ?
      `<ul style="font-size: 15px; line-height: 1.6; color: #222; margin-left: 20px; margin-bottom: 30px; list-style-type: disc;">${data.design.split('\n').map(item => `<li>${item.trim()}</li>`).join('')}</ul>` :
      `<ul style="font-size: 15px; line-height: 1.6; color: #222; margin-left: 20px; margin-bottom: 30px; list-style-type: disc;">
        <li>Custom design aligned with brand identity</li>
        <li>Responsive design for mobile, tablet, and desktop</li>
        <li>Cross-browser compatibility (Chrome, Safari, Firefox, Edge)</li>
      </ul>`;

    const developmentList = data.development ?
      `<ul style="font-size: 15px; line-height: 1.6; color: #222; margin-left: 20px; list-style-type: disc;">${data.development.split('\n').map(item => `<li>${item.trim()}</li>`).join('')}</ul>` :
      `<ul style="font-size: 15px; line-height: 1.6; color: #222; margin-left: 20px; list-style-type: disc;">
        <li>Built using HTML5, CSS3, JavaScript</li>
        <li>Basic SEO optimization (meta tags, keywords, alt tags)</li>
        <li>Contact form with email integration (Formspree/EmailJS)</li>
        <li>Google Maps integration</li>
        <li>Optimized for fast loading</li>
      </ul>`;

    const supportList = data.support ?
      `<ul style="font-size: 15px; line-height: 1.6; color: #000; margin-left: 20px; margin-bottom: 20px; list-style-type: disc;">${data.support.split('\n').map(item => `<li>${item.trim()}</li>`).join('')}</ul>` :
      `<ul style="font-size: 15px; line-height: 1.6; color: #000; margin-left: 20px; margin-bottom: 20px; list-style-type: disc;">
        <li>7 Days Free Post-Launch Support</li>
        <li>Security Monitoring & SSL Management</li>
        <li>WhatsApp Technical Assistance</li>
      </ul>`;

    const timelineList = data.timelineDetail ?
      `<ul style="font-size: 15px; line-height: 1.6; color: #000; margin-left: 20px; margin-bottom: 20px; list-style-type: disc;">${data.timelineDetail.split('\n').map(item => `<li>${item.trim()}</li>`).join('')}</ul>` :
      `<p style="font-size: 15px; line-height: 1.6; color: #000;">${time}</p>`;

    const pricingRows = (data.uniquePricingBreakdown || data.pricingBreakdown) ? 
      (data.uniquePricingBreakdown || data.pricingBreakdown).split('\n').filter(l => l.includes('|')).map(line => {
        const [service, itemPrice] = line.split('|').map(s => s.trim());
        return `<tr><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000;">${service}</td><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000;">${itemPrice}</td></tr>`;
      }).join('') :
      `<tr><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000;">static Website Development</td><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000;">₹15,000</td></tr>
      <tr><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000; text-transform: uppercase;">Domain</td><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000;">₹2000</td></tr>
      <tr><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000; text-transform: uppercase;">Server</td><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000;">₹5000</td></tr>
      <tr><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000; text-transform: uppercase;">SSL Certificate</td><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000;">₹3000</td></tr>
      <tr><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000; text-transform: uppercase;">WhatsApp Intigration</td><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000;">₹3000</td></tr>
      <tr><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000;">UI/UX Design (Upto 5 Pages)</td><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000;">₹6,000</td></tr>
      <tr><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000; text-transform: uppercase;">SEO Setup</td><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000;">₹3000</td></tr>
      <tr><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000; text-transform: uppercase;">Speed and Optimization</td><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000;">₹3,000</td></tr>
      <tr><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000; text-transform: uppercase;">Contact Form With Mail Integration</td><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000;">₹5,000</td></tr>`;

    const whatYouGetList = data.whatYouGet ?
      `<ul style="font-size: 15px; line-height: 1.8; color: #000; margin-left: 20px; list-style-type: disc;">${data.whatYouGet.split('\n').map(item => `<li>${item.trim()}</li>`).join('')}</ul>` :
      `<ul style="font-size: 15px; line-height: 1.8; color: #000; margin-left: 20px; list-style-type: disc;">
        <li>Fully developed, professional website.</li>
        <li>Domain & hosting setup (1st year included)</li>
        <li>Secure HTTPS connection</li>
        <li>Instagram & WhatsApp integration</li>
        <li>Optimized for mobile and fast loading</li>
        <li>Basic SEO setup to help you appear on search engines</li>
        <li>Smooth gallery to showcase your work</li>
        <li>Enquiry/booking form</li>
        <li>No hidden charges – fully transparent package</li>
      </ul>`;

    const termsList = data.termsConditions ?
      `<ul style="font-size: 14px; line-height: 1.6; color: #000; margin-left: 20px; margin-bottom: 40px; list-style-type: disc;">${data.termsConditions.split('\n').map(item => `<li style="margin-bottom: 4px;">${item.trim()}</li>`).join('')}</ul>` :
      `<ul style="font-size: 14px; line-height: 1.6; color: #000; margin-left: 20px; margin-bottom: 40px; list-style-type: disc;">
        <li style="margin-bottom: 4px;">The project includes a static website with up to 5 to 8 pages.</li>
        <li style="margin-bottom: 4px;">Project timeline is ${time} from the date of 60% advance payment and complete content submission.</li>
        <li style="margin-bottom: 4px;">Delay in content or approvals from the client will extend the delivery timeline.</li>
        <li style="margin-bottom: 4px;">The client must provide all text, images, logo, and contact details within 3 working days.</li>
        <li style="margin-bottom: 4px;">The total project cost is ₹${dPrice}/- (all inclusive).</li>
        <li style="margin-bottom: 4px;">60% advance payment is required to start the project.</li>
        <li style="margin-bottom: 4px;">The remaining 40% must be paid before final deployment.</li>
        <li style="margin-bottom: 4px;">All payments made are non-refundable.</li>
        <li style="margin-bottom: 4px;">Domain registration is included for 1 year.</li>
        <li style="margin-bottom: 4px;">Web hosting is included for 1 year.</li>
        <li style="margin-bottom: 4px;">SSL certificate worth ₹3,000 is included for 1 year.</li>
        <li style="margin-bottom: 4px;">Renewal charges for domain, hosting, and SSL will apply from the second year onward.</li>
        <li style="margin-bottom: 4px;">WhatsApp integration is included in the website.</li>
        <li style="margin-bottom: 4px;">The website will be fully responsive for mobile, tablet, and desktop.</li>
        <li style="margin-bottom: 4px;">Basic SEO setup is included (meta tags, titles, and descriptions).</li>
        <li style="margin-bottom: 4px;">After deployment, the client will receive full access credentials.</li>
        <li style="margin-bottom: 4px;">7 days of free technical support is included after launch.</li>
        <li style="margin-bottom: 4px;">Ongoing maintenance, updates, or content changes are not included.</li>
        <li style="margin-bottom: 4px;">After final payment, full ownership of the website is transferred to the client.</li>
        <li style="margin-bottom: 4px;">All client data will remain confidential and will not be shared with third parties.</li>
        <li style="margin-bottom: 4px;">If the client cancels the project after starting, the advance payment is non-refundable.</li>
        <li style="margin-bottom: 4px;">Any partial work done until cancellation will be billed accordingly.</li>
      </ul>`;

    content['page1'] = `<div style="text-align: left; padding-top: 100px; padding-left: 20px;">
  <h2 style="color: #e91e63; font-weight: 700; font-size: 20px; letter-spacing: 1px; margin-bottom: 5px;">STATIC WEBSITE</h2>
  <h1 style="color: #4a148c; font-size: 54px; font-weight: 800; line-height: 1.1; margin-bottom: 30px;">PROJECT<br/>PROPOSAL</h1>
  <p style="color: #333; font-size: 16px; margin-bottom: 80px; line-height: 1.5; font-weight: 500;">Project details and budget projections<br/>for website development</p>
  
  <div style="border-left: 3px solid #b39ddb; padding-left: 20px; margin-top: 100px;">
    <p style="color: #e91e63; font-weight: 700; font-size: 14px; margin-bottom: 8px;">Presented to</p>
    <p style="font-size: 16px; color: #333; margin-bottom: 25px; font-weight: 600;">${cName.toUpperCase()}</p>
    
    <p style="color: #e91e63; font-weight: 700; font-size: 14px; margin-bottom: 8px;">Presented by</p>
    <p style="font-size: 16px; color: #333; font-weight: 600;">TARUNA TECHNOLOGY</p>
  </div>
</div>`;

    content['page2'] = `<div>
  <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 25px; color: #000;">Executive Summary</h2>
  ${execSummary}
  
  <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">Our Services Include:</h3>
  <ul style="font-size: 15px; line-height: 1.6; color: #222; margin-left: 20px; margin-bottom: 25px; list-style-type: disc;">
    <li>Domain Registration</li>
    <li>Server Setup</li>
    <li>SSL Security Implementation</li>
    <li>WhatsApp Integration for Instant Communication</li>
    <li>Essential SEO Enhancements</li>
    <li>Mobile-First Responsive Design</li>
  </ul>
  
  <p style="font-size: 15px; line-height: 1.6; color: #222; margin-bottom: 15px;">We ensure your website is not only visually stunning but also technically strong, secure, and optimized for search engines to maximize visibility and conversions.</p>
  <p style="font-size: 15px; line-height: 1.6; color: #222;">With our expertise in modern web technologies, we are committed to delivering a seamless, fast, and future-ready digital experience that reflects the premium identity of <strong>${cName}</strong> and meets evolving customer expectations.</p>
</div>`;

    content['page3'] = `<div>
  <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 30px; color: #000;">Scope of Work</h2>
  ${scope}
  
  <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 10px; color: #000;">Website Structure</h3>
  ${structure}

  <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 10px; color: #000;">Design</h3>
  ${designList}

  <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 10px; color: #000;">Development</h3>
  ${developmentList}
</div>`;

    content['page4'] = `<div>
  <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 20px; color: #c2185b;">Pricing Breakdown</h2>
  <p style="font-size: 13px; font-weight: 700; line-height: 1.5; color: #000; margin-bottom: 20px;">We provide a comprehensive website development package that includes all essential services to establish a robust and high-performing online presence. Our one-time pricing ensures transparency with no hidden costs.</p>
  
  <table style="width: 100%; border-collapse: collapse; font-size: 13px; font-weight: 700; text-align: center; border: 1px solid #c7d2fe;">
    <thead>
      <tr>
        <th style="padding: 14px; border: 1px solid #c7d2fe; width: 50%; background-color: #e8eaf6; color: #000;">Service</th>
        <th style="padding: 14px; border: 1px solid #c7d2fe; width: 50%; background-color: #e8eaf6; color: #000;">Price (₹)</th>
      </tr>
    </thead>
    <tbody>
      ${pricingRows}
      <tr><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000;">Total Cost (One-Time)</td><td style="padding: 18px 14px; border: 1px solid #c7d2fe; color: #000; font-weight: bold;">₹${price}</td></tr>
    </tbody>
  </table>
</div>`;

    content['page5'] = `<div style="text-align: center;">
  <h2 style="font-size: 24px; font-weight: 800; color: #e53935; margin-bottom: 40px;">Special Offer</h2>
  <h3 style="font-size: 22px; font-weight: 800; color: #e53935; margin-bottom: 10px;">Discounted Price: ₹${dPrice} (One-Time Cost)</h3>
  <h3 style="font-size: 22px; font-weight: 800; color: #e53935; margin-bottom: 40px;">Complimentary Service: Logo Designing<br/>(Worth ₹3,000 - ₹5,000)</h3>
  
  <div style="text-align: left; max-width: 550px; margin: 0 auto;">
    <h3 style="font-size: 20px; font-weight: 800; color: #c2185b; margin-bottom: 25px;">What You Get</h3>
    ${whatYouGetList}
  </div>
</div>`;

    content['page6'] = `<div>
  <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 30px; color: #c2185b;">Terms & Conditions:</h2>
  ${termsList}
  
  <h3 style="font-size: 13px; font-weight: 800; margin-bottom: 10px; color: #000;">Agreement and Signatures</h3>
  <p style="font-size: 11px; color: #000; margin-bottom: 25px; line-height: 1.4;">By signing below, both parties acknowledge and agree to the terms and conditions set forth in this Agreement and commit to fulfill their respective obligations.</p>
  
  <p style="font-size: 11px; color: #000; margin-bottom: 20px;">Client Name: ___________________________________ Date: ___________________</p>
  <p style="font-size: 11px; color: #000; margin-bottom: 20px;">Client Signature: ___________________________________</p>
  <p style="font-size: 11px; color: #000; margin-bottom: 30px;">Place: ___________________________</p>
  <p style="font-size: 11px; color: #000;">| Authorized Signatory (Taruna Technology): ___________________________ | Date: _______________ |</p>
</div>`;

    content['page7'] = `<div>
  <h2 style="font-size: 18px; font-weight: 800; margin-bottom: 40px; color: #000; text-align: center; letter-spacing: 1px;">WEBSITE DEVELOPMENT AGREEMENT</h2>
  
  <p style="font-size: 16px; font-weight: 800; color: #000; margin-bottom: 40px; line-height: 1.6; text-align: center;">
    This Software Development Agreement ("Agreement") is<br/>made and entered into on this ___ day of ________, 2026, by<br/>and between:
  </p>

  <div style="text-align: center; margin-bottom: 40px;">
    <p style="font-size: 18px; font-weight: 800; color: #000; margin-bottom: 5px;">Taruna Technology</p>
    <p style="font-size: 18px; font-weight: 800; color: #000;">Email: tarunatechnology@gmail.com</p>
  </div>
  
  <h3 style="font-size: 20px; font-weight: 800; text-align: center; color: #000; margin-bottom: 40px;">AND</h3>

  <div style="max-width: 450px; margin: 0 auto; text-align: left;">
    <p style="font-size: 18px; font-weight: 800; color: #000; margin-bottom: 20px;">Client Name: <span style="font-weight: 400;">${cName}</span></p>
    <p style="font-size: 18px; font-weight: 800; color: #000; margin-bottom: 20px;">Address: <span style="font-weight: 400;">___________________________________</span></p>
    <p style="font-size: 18px; font-weight: 800; color: #000; margin-bottom: 20px;">Email: <span style="font-weight: 400;">_____________________________________</span></p>
    <p style="font-size: 18px; font-weight: 800; color: #000;">Phone: <span style="font-weight: 400;">_____________________________________</span></p>
  </div>
</div>`;

    content['page8'] = `<div>
  <h2 style="font-size: 32px; font-weight: 800; color: #c2185b; margin-top: 120px; margin-bottom: 5px; text-transform: uppercase;">FOR INQUIRIES,</h2>
  <h2 style="font-size: 36px; font-weight: 800; color: #311b92; margin-bottom: 40px;">CONTACT US</h2>
  
  <div style="display: flex; align-items: center; margin-bottom: 25px;">
    <div style="width: 40px; height: 40px; border-radius: 50%; background: #5c6bc0; display: flex; align-items: center; justify-content: center; margin-right: 20px; color: white;">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
    </div>
    <span style="font-size: 18px; color: #000; font-weight: 500;">www.tarunatech.com</span>
  </div>
  
  <div style="display: flex; align-items: center; margin-bottom: 25px;">
    <div style="width: 40px; height: 40px; border-radius: 50%; background: #c2185b; display: flex; align-items: center; justify-content: center; margin-right: 20px; color: white;">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
    </div>
    <span style="font-size: 18px; color: #000; font-weight: 500;">+91 910 6610 595</span>
  </div>
  
  <div style="display: flex; align-items: center; margin-bottom: 25px;">
    <div style="width: 40px; height: 40px; border-radius: 50%; background: #5c6bc0; display: flex; align-items: center; justify-content: center; margin-right: 20px; color: white;">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
    </div>
    <span style="font-size: 18px; color: #000; font-weight: 500;">tarunatechnology@gmail.com</span>
  </div>
  
  <div style="display: flex; align-items: flex-start;">
    <div style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #000; display: flex; align-items: center; justify-content: center; margin-right: 20px; margin-top: 2px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
    </div>
    <span style="font-size: 17px; color: #000; font-weight: 500; max-width: 320px; line-height: 1.6;">709,710 Broadway Empire, circle, Vasna Bhayli Main Rd, Vadodara, Gujarat 391410</span>
  </div>
</div>`;

    return content;
  };



  const handleGenerateSmartPricing = async () => {
    const data = getValues();
    if (!data.projectPrice) {
      alert('Please enter a Project Price first');
      return;
    }

    try {
      setIsAiGenerating(true);
      // Clean price of commas if any
      const cleanPrice = data.projectPrice.replace(/,/g, '');
      
      const baseUrl = import.meta.env.VITE_API_URL || 'https://taruna.onrender.com/api';
      const response = await fetch(`${baseUrl}/pricing/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectPrice: cleanPrice,
          projectType: selectedTemplate.name,
          companyName: data.companyName,
          industry: data.industry,
          businessGoals: data.proposalTitle
        })
      });

      const result = await response.json();
      if (result.success) {
        setValue('uniquePricingBreakdown', result.formattedString);
      } else {
        alert(result.message || 'Failed to generate smart pricing');
      }
    } catch (error) {
      console.error('Smart Pricing Error:', error);
      alert('Failed to generate smart pricing. Please check if backend is running.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAISummary = async (sectionId) => {
    if (sectionId === 'uniquePricingBreakdown') {
      await handleGenerateSmartPricing();
      return;
    }
    
    const data = getValues();
    const currentText = data[sectionId];
    
    if (!data.companyName || !selectedTemplate || !data.industry) {
      alert('Please enter Company Name, Industry and select a template first.');
      return;
    }
    
    const specificGoal = sectionId === 'executiveSummary' 
      ? `${data.proposalTitle || "Premium Project"} - Strategic Vision & High-Level Mission`
      : `${data.proposalTitle || "Premium Project"} - Detailed Technical Implementation & Execution`;

    const summary = await generateSummary({
      companyName: data.companyName,
      industry: data.industry,
      businessGoals: specificGoal, 
      section: sectionId,
      projectType: selectedTemplate.name,
      context: currentText
    });

    if (summary) {
      setValue(sectionId, summary);
    }
  };

  const handleUseDefault = (field) => {
    const cName = getValues('companyName') || 'CLIENT NAME';
    const val = typeof DEFAULT_TEMPLATES[field] === 'function' 
      ? DEFAULT_TEMPLATES[field](cName) 
      : DEFAULT_TEMPLATES[field];
    setValue(field, val);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Create New Proposal</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-slate-500">
              {step === 1 ? 'Step 1: Choose a professional template' : 'Step 2: Fill in proposal details'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-10 h-2 rounded-full transition-all ${step === 1 ? 'bg-brand-600' : 'bg-brand-200'}`}></div>
          <div className={`w-10 h-2 rounded-full transition-all ${step === 2 ? 'bg-brand-600' : 'bg-brand-200'}`}></div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template);
                  setStep(2);
                }}
                className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col group relative overflow-hidden ${
                  selectedTemplate?.id === template.id 
                    ? 'border-brand-600 bg-white shadow-xl shadow-brand-500/10' 
                    : 'border-white bg-white hover:border-slate-200 hover:shadow-lg'
                }`}
              >
                <div className={`w-12 h-12 ${template.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-inherit/30 group-hover:scale-110 transition-transform`}>
                  <template.icon size={24} />
                </div>
                <div className="relative z-10 mt-auto">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{template.category}</p>
                  <h3 className="text-lg font-bold text-slate-900">{template.name}</h3>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-125 transition-transform"></div>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40"
          >
            {(localError || storeError) && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-medium">
                <AlertCircle size={20} />
                {localError || storeError}
              </div>
            )}
            <form onSubmit={handleSubmit(handleStandardSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Proposal Name (Internal)</label>
                  <input
                    {...register('name', { required: 'Proposal name is required' })}
                    type="text"
                    placeholder="e.g. Acme Website Design - Q4"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all"
                  />
                  {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Proposal Title (Public)</label>
                  <input
                    {...register('proposalTitle', { required: 'Proposal title is required' })}
                    type="text"
                    placeholder="e.g. Proposal for Professional Website Redesign"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all"
                  />
                  {errors.proposalTitle && <p className="mt-1 text-xs text-rose-500">{errors.proposalTitle.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Client Contact Person</label>
                  <input
                    {...register('clientName', { required: 'Client name is required' })}
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all"
                  />
                  {errors.clientName && <p className="mt-1 text-xs text-rose-500">{errors.clientName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                  <input
                    {...register('companyName', { required: 'Company name is required' })}
                    type="text"
                    placeholder="Acme Corporation"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all"
                  />
                  {errors.companyName && <p className="mt-1 text-xs text-rose-500">{errors.companyName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Industry</label>
                  <input
                    {...register('industry')}
                    type="text"
                    placeholder="e.g. Technology, Cosmetics, Retail"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Project Price</label>
                  <input
                    {...register('projectPrice')}
                    type="text"
                    placeholder="e.g. 45,000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Discounted Price (Special Offer)</label>
                  <input
                    {...register('discountedPrice')}
                    type="text"
                    placeholder="e.g. 35,000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Project Timeline</label>
                  <input
                    {...register('timeline')}
                    type="text"
                    placeholder="e.g. 7-10 working days"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all"
                  />
                </div>

                {[
                  { id: 'uniqueExecutiveSummary', label: '1. EXECUTIVE SUMMARY', placeholder: 'Describe the project objective...', btnText: 'AI Summary', showAI: true },
                  { id: 'uniqueScopeOfWork', label: '2. SCOPE OF WORK', placeholder: 'Detail the technical execution...', btnText: 'Create Scope', showAI: true },
                  { id: 'websiteStructure', label: '3. WEBSITE STRUCTURE', placeholder: 'e.g. Home, About, Services, Contact...', showAI: false },
                  { id: 'design', label: '4. DESIGN & UI/UX', placeholder: 'Describe the visual approach...', showAI: false },
                  { id: 'development', label: '5. TECHNICAL DEVELOPMENT', placeholder: 'Technical stack and features...', showAI: false },
                  { id: 'uniquePricingBreakdown', label: '6. PRICING BREAKDOWN', placeholder: 'Service Name | Price (one per line)', btnText: 'Generate Smart Pricing', showAI: true },
                  { id: 'whatYouGet', label: '7. FINAL DELIVERABLES', placeholder: 'List what the client will receive...', showAI: false },
                  { id: 'timelineDetail', label: '8. DETAILED TIMELINE', placeholder: 'Phase by phase breakdown...', showAI: false },
                  { id: 'support', label: '9. MAINTENANCE & SUPPORT', placeholder: 'Post-launch support details...', showAI: false },
                  { id: 'termsConditions', label: '10. TERMS & CONDITIONS', placeholder: 'Project terms and rules...', showAI: false }
                ].map((section) => (
                  <div key={section.id} className="md:col-span-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-slate-700">{section.label}</label>
                      <div className="flex items-center gap-2">
                        {section.showAI && (
                          <button
                            type="button"
                            onClick={() => handleAISummary(section.id)}
                            className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg hover:bg-indigo-100 transition-colors uppercase tracking-wider flex items-center gap-1"
                          >
                            <Sparkles size={12} />
                            {section.btnText}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleUseDefault(section.id)}
                          className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg hover:bg-brand-100 transition-colors uppercase tracking-wider"
                        >
                          Keep as it is
                        </button>
                      </div>
                    </div>
                    {section.id === 'websiteStructure' ? (
                      <div className="space-y-3">
                        {structureFields.map((field, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              value={field}
                              onChange={(e) => handleStructureChange(idx, e.target.value)}
                              placeholder={`Page/Section ${idx + 1}`}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:bg-white focus:border-brand-500 transition-all text-sm"
                            />
                            {idx === structureFields.length - 1 && (
                              <button
                                type="button"
                                onClick={addStructureField}
                                className="p-3 bg-brand-50 text-brand-600 rounded-xl hover:bg-brand-100 transition-colors"
                              >
                                <Plus size={20} />
                              </button>
                            )}
                            {structureFields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeStructureField(idx)}
                                className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <textarea
                        {...register(section.id)}
                        rows={section.id === 'uniqueExecutiveSummary' ? 10 : 4}
                        placeholder={section.placeholder}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-slate-100 mt-8 gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
                
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-brand-600 hover:bg-brand-700 text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70"
                  >
                    <span>Generate Proposal</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateProposal;
