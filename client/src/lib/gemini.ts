// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Pastikan environment variable sudah benar
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey || "dummy-key");

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite", // Update model yang lebih stabil
});

// Fungsi helper untuk generate content dengan error handling
export const generateContent = async (prompt: string): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error("API key tidak tersedia");
    }

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};
