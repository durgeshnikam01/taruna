require("dotenv").config();
const aiService = require("./services/aiService");

/**
 * GEMINI AI INTEGRATION TEST SCRIPT
 * Run this to verify your backend setup: node backend/test-gemini.js
 */
async function runTest() {
    console.log("--- STARTING GEMINI AI TEST ---");
    console.log("Using Model:", aiService.modelName);
    
    const testData = {
        companyName: "Opal Aesthetic Clinic",
        industry: "Healthcare",
        businessGoals: "Create a premium website with appointment booking and SEO optimization"
    };

    try {
        console.log("Sending request to Gemini...");
        const summary = await aiService.generateExecutiveSummary(testData);
        
        console.log("\n✅ SUCCESS! Response received:");
        console.log("--------------------------------------------------");
        console.log(summary);
        console.log("--------------------------------------------------");
    } catch (error) {
        console.error("\n❌ TEST FAILED!");
        console.error("Error Message:", error.message);
        
        if (error.message.includes("404")) {
            console.log("\nHINT: Your region might not support 'gemini-1.5-flash-latest'. Try 'gemini-1.5-flash' in aiService.js.");
        }
    }
}

runTest();
