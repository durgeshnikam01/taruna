const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a proposal name']
  },
  clientName: {
    type: String,
    required: [true, 'Please add a client name']
  },
  companyName: {
    type: String,
    required: [true, 'Please add a company name']
  },
  proposalTitle: {
    type: String,
    required: [true, 'Please add a proposal title']
  },
  projectType: {
    type: String,
    required: [true, 'Please add a project type']
  },
  industry: {
    type: String
  },
  templateId: {
    type: String
  },
  templateType: {
    type: String,
    default: 'image'
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  boxes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  pricingRows: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  pages: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Proposal', proposalSchema);
