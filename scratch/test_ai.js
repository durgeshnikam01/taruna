const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: './backend/.env' });

async function listAndRunModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY in .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // 1. (Optional) Check exactly what models your key can access
    const availableModels = await genAI.listModels();
    console.log("Your available models are:");
    availableModels.models.forEach(m => console.log(` - ${m.name}`));

    // 2. Use the updated 2026 model name
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    console.log("\nTesting gemini-3-flash-preview...");
    const result = await model.generateContent("Hello! Are you working?");
    const response = await result.response;
    console.log("✅ Success:", response.text());

  } catch (error) {
    console.error("❌ Error:", error.message);

    // If gemini-3 is not in your region yet, try the 2.5 series
    if (error.message.includes("404")) {
      console.log("Trying fallback to gemini-2.5-flash...");
      try {
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await fallbackModel.generateContent("Test");
        console.log("✅ Success with gemini-2.5-flash");
      } catch (err2) {
        console.error("❌ Fallback failed:", err2.message);
      }
    }
  }
}

listAndRunModel();