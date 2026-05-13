require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    console.log("Using API Key:", apiKey.substring(0, 5) + "...");
    
    if (!apiKey) {
        console.error("No API key found in .env");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const models = ["gemini-1.5-flash", "gemini-1.5-pro"];
        
        for (const name of models) {
            try {
                console.log(`Testing model: ${name}`);
                const model = genAI.getGenerativeModel({ model: name });
                const result = await model.generateContent("Say hello");
                const response = await result.response;
                console.log(`Success with ${name}:`, response.text());
                return;
            } catch (err) {
                console.error(`Failed with ${name}:`, err.message);
            }
        }
    } catch (err) {
        console.error("Initialization failed:", err.message);
    }
}

testGemini();
