require("dotenv").config();
const aiService = require("./services/aiService");

/**
 * GEMINI PROFESSIONAL VERIFICATION SCRIPT
 * Run this to verify: node backend/verify-gemini.js
 */
async function test() {
    console.log("--- GEMINI 1.5 FLASH VERIFICATION ---");
    console.log("Model:", aiService.modelName);

    const payload = {
        companyName: "Opal Aesthetic Clinic",
        industry: "Healthcare",
        businessGoals: "High-end clinic website with SEO"
    };

    try {
        console.log("Status: Sending Request...");
        const result = await aiService.generateSummary(payload);
        console.log("\n✅ INTEGRATION SUCCESSFUL!");
        console.log("Result Preview:", result.substring(0, 100) + "...");
    } catch (error) {
        console.error("\n❌ INTEGRATION FAILED!");
        console.error("Reason:", error.message);
        
        if (error.message.includes("404")) {
            console.log("\nHINT: If you get 404, check if your API Key is for Google Gemini. If you are using OpenAI key, use OPENAI_API_KEY instead.");
        }
    }
}

test();
