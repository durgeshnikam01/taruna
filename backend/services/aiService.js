/**
 * SENIOR NODE.JS AI SERVICE
 * VERSION 7.1 - Force Precision Architecture (Absolute Control)
 */
class AIService {
    constructor() {
        console.log("--- AI SERVICE LOADED: VERSION 7.1 (FORCE PRECISION) ---");
        this.groqKey = (process.env.GROQ_API_KEY || process.env.groq_API_KEY || "").trim();
    }

    async generateSummary(data) {
        const { section, companyName, industry, businessGoals, projectType = "Professional Services" } = data;
        const sectionKey = section || "uniqueExecutiveSummary";

        if (!this.groqKey) {
            throw new Error("GROQ_API_KEY is missing in .env file");
        }

        // Section-specific Configuration
        const configs = {
            "uniqueExecutiveSummary": {
                prompt: `Write a high-fidelity Executive Summary for ${companyName}. 
                STRUCTURE: Exactly 4 paragraphs.
                WORD COUNT: Exactly 40 words per paragraph (Target: 160 words total).
                TONE: Visionary, strategic, and professional.
                CONTENT: 
                Para 1: Digital transformation and market position.
                Para 2: Strategic vision and value proposition.
                Para 3: Operational business impact.
                Para 4: ROI and long-term financial growth.
                STRICT RESTRAINT: You must hit the 200-word mark. No introductory text. No markdown.`,
                maxTokens: 1000,
                temperature: 0.5,
                systemRole: "You are a precise corporate architect. You follow word count instructions with mathematical exactness. You never use markdown."
            },
            "uniqueScopeOfWork": {
                prompt: `Write a high-density TECHNICAL SCOPE OF WORK for ${companyName}.
                STRICT TARGET: EXACTLY 50 Words total.
                TONE: Surgical, technical, and direct.
                CONTENT: Focus strictly on architecture, tech stack, and execution phases.
                RESTRAINT: DO NOT exceed 50 words. No introductory fluff. No vision. No goals. Surgical technical precision only.`,
                maxTokens: 500,
                temperature: 0.2, // Ultra-low for strict adherence
                systemRole: "You are a surgical technical architect. You follow word counts with EXTREME precision. You never use markdown. You are brief, technical, and never exceed 50 words."
            }
        };

        const config = configs[sectionKey] || configs["uniqueExecutiveSummary"];

        const finalPrompt = `
            Task: ${config.prompt}
            
            CLIENT CONTEXT:
            - Client: ${companyName}
            - Industry: ${industry}
            - Strategic Mission: ${businessGoals}
            - Service Category: ${projectType}

            STRICT FORMATTING:
            1. NO Markdown (no # or *). Use plain text only.
            2. Start the content IMMEDIATELY. No greetings. No intros.
        `;

        try {
            console.log(`[AI_ENGINE]: Generating ${sectionKey} with Force Precision...`);
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.groqKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: config.systemRole },
                        { role: "user", content: finalPrompt }
                    ],
                    temperature: config.temperature,
                    max_tokens: config.maxTokens
                })
            });

            const result = await response.json();

            if (result.error) {
                throw new Error(`Groq API Error: ${result.error.message}`);
            }

            if (result.choices && result.choices[0]) {
                return result.choices[0].message.content.trim();
            } else {
                throw new Error("Groq returned no content.");
            }
        } catch (err) {
            console.error(`[AI_ENGINE]: AI Generation Failed:`, err.message);
            throw new Error(`AI Engine Error: ${err.message}`);
        }
    }

    async classifyProject(data) {
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.groqKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: "You are a business strategist. Classify the following project into one of these exact keys: staticWebsite, ecommerce, erp, saas. Output ONLY the key name, nothing else."
                        },
                        {
                            role: "user",
                            content: `Project Type: ${data.projectType}\nIndustry: ${data.industry}\nGoals: ${data.businessGoals || data.proposalTitle}`
                        }
                    ],
                    temperature: 0.1
                })
            });

            const result = await response.json();
            const key = result.choices[0].message.content.trim();
            // Fallback to staticWebsite if AI gives something else
            const validKeys = ['staticWebsite', 'ecommerce', 'erp', 'saas'];
            return validKeys.includes(key) ? key : 'staticWebsite';
        } catch (error) {
            console.error('AI Classification Error:', error);
            return 'staticWebsite';
        }
    }
}

module.exports = new AIService();