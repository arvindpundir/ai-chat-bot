import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ This API is enabled for all Gemini keys
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.post("/api/openai", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const result = await model.generateContent(message);
    const text = result.response.text();

    res.json({ text });
  } catch (err) {
    console.error("GEMINI ERROR:", err);
    res.status(500).json({
      error: "Gemini request failed",
      details: err.message,
    });
  }
});

const PORT = 5178;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
