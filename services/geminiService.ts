import { GoogleGenAI, Type } from "@google/genai";
import { DietMode } from "../types";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export const getFoodSuggestions = async (mode: DietMode, currentCount: number): Promise<string[]> => {
  if (!apiKey) {
    console.warn("API Key is missing for Gemini suggestions.");
    // Fallback or empty if no key
    return ["Mì Gói", "Trứng Luộc", "Rau Luộc", "Cơm Chiên"]; 
  }

  const prompt = `Suggest ${5} popular Vietnamese dishes suitable for a "${mode}" diet. 
  Just return the names of the dishes. 
  Return a JSON array of strings. 
  Do not include explanations.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    if (response.text) {
      const suggestions = JSON.parse(response.text);
      return Array.isArray(suggestions) ? suggestions : [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching food suggestions:", error);
    return [];
  }
};
