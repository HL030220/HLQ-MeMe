import { GoogleGenAI } from "@google/genai";
import { StickerGenerationParams } from "../types";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

/**
 * Generates a Q-version sticker based on an input image and a text prompt.
 */
export const generateSticker = async ({ base64Image, prompt, subjectDescription }: StickerGenerationParams): Promise<string> => {
  try {
    // Remove data URL prefix if present (e.g., "data:image/png;base64,")
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    // Determine target instruction based on user input
    const targetInstruction = subjectDescription 
      ? `Target Subject: The user has identified the specific character to process as: "${subjectDescription}". You MUST focus ONLY on this character and ignore everyone else in the image.`
      : `Target Subject: Focus on the central or most prominent character in the image.`;

    // Construct a specialized system prompt for consistent style
    const styleInstruction = `
      You are an expert character designer specializing in "Q-version" (Chibi) stickers and emojis.
      
      Task:
      1. Analyze the provided image. ${targetInstruction}
      2. Identify this specific character's key features (hair, eyes, outfit, accessories).
      3. Redraw this character as a high-quality vector-style sticker.
      4. Apply the specific emotion or action requested: "${prompt}".
      
      Style Requirements:
      - Cute, Chibi/Q-version proportions (large head, small body).
      - Expressive facial features.
      - Clean, bold lines with flat, vibrant colors.
      - A thick white outline around the character (sticker die-cut style).
      - White or transparent background.
      - High fidelity and artistic quality.
      - DO NOT include multiple characters unless specifically asked in the emotion prompt.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/png', // Assuming PNG/JPEG, API handles generic image types well
            },
          },
          {
            text: styleInstruction,
          },
        ],
      },
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated.");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in the response.");

  } catch (error) {
    console.error("Sticker generation failed:", error);
    throw error;
  }
};