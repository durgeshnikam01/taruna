const asyncHandler = require('express-async-handler');
const Proposal = require('../models/Proposal');

// @desc    Get all proposals for logged in user
// @route   GET /api/proposals
// @access  Private
const getProposals = asyncHandler(async (req, res) => {
  const proposals = await Proposal.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(proposals);
});

// @desc    Get single proposal
// @route   GET /api/proposals/:id
// @access  Private
const getProposal = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findById(req.params.id);

  if (!proposal) {
    res.status(404);
    throw new Error('Proposal not found');
  }

  // Check for user
  if (proposal.createdBy.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  res.status(200).json(proposal);
});

// @desc    Create proposal
// @route   POST /api/proposals
// @access  Private
const createProposal = asyncHandler(async (req, res) => {
  const { name, clientName, companyName, proposalTitle, projectType } = req.body;

  if (!name || !clientName || !companyName || !proposalTitle || !projectType) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const proposal = await Proposal.create({
    ...req.body,
    createdBy: req.user.id
  });

  res.status(201).json(proposal);
});

// @desc    Update proposal
// @route   PUT /api/proposals/:id
// @access  Private
const updateProposal = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findById(req.params.id);

  if (!proposal) {
    res.status(404);
    throw new Error('Proposal not found');
  }

  // Check for user
  if (proposal.createdBy.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedProposal = await Proposal.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  res.status(200).json(updatedProposal);
});

// @desc    Delete proposal
// @route   DELETE /api/proposals/:id
// @access  Private
const deleteProposal = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findById(req.params.id);

  if (!proposal) {
    res.status(404);
    throw new Error('Proposal not found');
  }

  // Check for user
  if (proposal.createdBy.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await proposal.deleteOne();

  res.status(200).json({ id: req.params.id });
});

// @desc    Duplicate proposal
// @route   POST /api/proposals/duplicate/:id
// @access  Private
const duplicateProposal = asyncHandler(async (req, res) => {
  const original = await Proposal.findById(req.params.id);

  if (!original) {
    res.status(404);
    throw new Error('Proposal not found');
  }

  // Check for user
  if (original.createdBy.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const duplicateData = original.toObject();
  delete duplicateData._id;
  delete duplicateData.createdAt;
  delete duplicateData.updatedAt;
  duplicateData.name = `${original.name} (Copy)`;

  const duplicate = await Proposal.create(duplicateData);

  res.status(201).json(duplicate);
});

const { generateProposalContent } = require('../services/aiService');

// @desc    Generate AI Proposal Content
// @route   POST /api/proposals/generate-ai
// @access  Private
const generateAIProposal = asyncHandler(async (req, res) => {
  const { proposalTitle, projectType, clientName, companyName, industry } = req.body;

  if (!proposalTitle || !projectType || !clientName || !companyName) {
    res.status(400);
    throw new Error('Please provide all required fields for AI generation');
  }

  try {
    const aiContent = await generateProposalContent(req.body);
    
    // Default boxes for the generated content
    const defaultBoxes = {};
    for (let i = 1; i <= 8; i++) {
      defaultBoxes[`page${i}`] = { x: 80, y: 150, width: 640, height: 750, fontSize: 16, textAlign: 'left' };
    }
    // Adjust cover page box
    defaultBoxes['page1'] = { x: 50, y: 350, width: 700, height: 600, fontSize: 16, textAlign: 'left' };

    res.status(200).json({
      content: aiContent,
      boxes: defaultBoxes
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || 'Failed to generate AI content');
  }
});

const { generateSectionSummary } = require('../services/aiService');

// @desc    Generate a specific section summary (like Executive Summary)
// @route   POST /api/proposals/generate-summary
// @access  Private
const generateSummary = asyncHandler(async (req, res) => {
  const { section, projectType, companyName, industry } = req.body;

  if (!projectType || !companyName) {
    res.status(400);
    throw new Error('Project type and company name are required');
  }

  try {
    const summary = await generateSectionSummary(req.body);
    res.status(200).json({ summary });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || 'Failed to generate AI summary');
  }
});

module.exports = {
  getProposals,
  getProposal,
  createProposal,
  updateProposal,
  deleteProposal,
  duplicateProposal,
  generateAIProposal,
  generateSummary
};
