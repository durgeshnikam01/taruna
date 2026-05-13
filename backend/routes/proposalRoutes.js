const express = require('express');
const router = express.Router();
const {
  getProposals,
  getProposal,
  createProposal,
  updateProposal,
  deleteProposal,
  duplicateProposal,
  generateAIProposal,
  generateSummary
} = require('../controllers/proposalController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getProposals)
  .post(protect, createProposal);

router.post('/generate-ai', protect, generateAIProposal);
router.post('/generate-summary', protect, generateSummary);
router.post('/duplicate/:id', protect, duplicateProposal);

router.route('/:id')
  .get(protect, getProposal)
  .put(protect, updateProposal)
  .delete(protect, deleteProposal);

module.exports = router;
