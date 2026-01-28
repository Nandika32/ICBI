const { GoogleGenerativeAI } = require("@google/generative-ai");

const chatWithAI = async (req, res) => {
    try {
        const { message, context } = req.body;

        // Context might include user role or specific sample details from frontend
        // For now, we'll build a system instruction

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "AI Service not configured (Missing Key)" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const systemPrompt = `
You are the AI Research Assistant for the "Integrated Cancer Biobank of India" (ICBI) platform.
Your users are either Researchers looking for tissue samples or Hospital staff managing them.

Platform Data Schema for context:
- Samples have: Cancer Type, Tissue Type (Tumor, Normal, etc), Patient Age, Gender, Preservation Method (FFPE, Frozen), Quantity.
- Hospitals: Apollo, Tata Memorial, AIIMS, etc.

Your Goal:
- Assist researchers in finding samples (even though you can't query the DB directly yet, guide them on how to search).
- Explain platform features.
- Provide general oncology knowledge related to biobanking.
- Be professional, helpful, and concise.

User Message: "${message}"
        `;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to generate AI response" });
    }
};

module.exports = { chatWithAI };
