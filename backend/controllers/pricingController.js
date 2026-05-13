const PricingEngine = require('../services/pricingEngine');
const aiService = require('../services/aiService');

/**
 * Generate Smart Pricing
 * 1. AI classifies the project
 * 2. Backend calculates the exact math
 */
const generateSmartPricing = async (req, res) => {
  try {
    const { projectPrice, projectType, industry, companyName, businessGoals } = req.body;

    if (!projectPrice) {
      return res.status(400).json({ message: "Project price is required for calculation" });
    }

    // STEP 1: AI analyzes category
    const category = await aiService.classifyProject({
      projectType,
      industry,
      companyName,
      businessGoals
    });

    // STEP 2: Calculate exact pricing mathematically
    const items = PricingEngine.calculate(projectPrice, category);
    const formattedString = PricingEngine.getFormattedString(items);

    res.json({
      success: true,
      category,
      items,
      formattedString,
      totalPrice: projectPrice
    });

  } catch (error) {
    console.error('Pricing Controller Error:', error);
    res.status(500).json({ message: "Internal server error in pricing engine" });
  }
};

module.exports = {
  generateSmartPricing
};
