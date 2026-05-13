const express = require('express');
const router = express.Router();
const { generateSmartPricing } = require('../controllers/pricingController');

// POST /api/pricing/generate
router.post('/generate', generateSmartPricing);

module.exports = router;
