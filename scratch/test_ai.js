const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: './backend/.env' });

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("test");
    console.log("Success with gemini-1.5-flash");
  } catch (error) {
    console.log("Error with gemini-1.5-flash:", error.message);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent("test");
      console.log("Success with gemini-1.5-pro");
    } catch (err2) {
      console.log("Error with gemini-1.5-pro:", err2.message);
    }
  }
}

listModels();
