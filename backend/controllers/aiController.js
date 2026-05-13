const asyncHandler = require("express-async-handler");
const aiService = require("../services/aiService");

/**
 * @desc    Professional AI Summary Controller
 * @route   POST /api/ai/generate-summary
 * @access  Private
 */
const generateSummary = asyncHandler(async (req, res) => {
    const { companyName, industry, businessGoals, section, projectType } = req.body;

    // Strict Validation
    if (!companyName || !industry || !businessGoals) {
        res.status(400);
        throw new Error("Validation Failed: companyName, industry, and businessGoals are required.");
    }

    try {
        console.log(`[AI_REQUEST]: Generating ${section || 'summary'} for ${companyName}...`);
        
        const summary = await aiService.generateSummary({
            companyName,
            industry,
            businessGoals,
            section,
            projectType
        });

        res.status(200).json({
            success: true,
            summary
        });
    } catch (error) {
        // Pass error to professional error middleware
        res.status(500);
        throw new Error(error.message || "Internal AI Server Error");
    }
});

module.exports = {
    generateSummary
};
