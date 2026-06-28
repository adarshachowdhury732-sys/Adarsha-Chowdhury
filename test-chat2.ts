import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { "User-Agent": "aistudio-build" } }
});

async function main() {
  try {
    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash-lite",
      contents: [{ role: "user", parts: [{ text: "write a simple hello world in python" }] }],
      config: {
        systemInstruction: "You are Barsha",
        temperature: 0.4,
        tools: [
          {
            functionDeclarations: [
              {
                name: "generate_image",
                description: "Generate or edit an image based on a prompt. Refuse if explicit.",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    prompt: {
                      type: Type.STRING,
                      description: "The prompt describing the image to generate or edit.",
                    },
                  },
                  required: ["prompt"],
                },
              },
            ],
          },
        ],
      }
    });
    for await (const chunk of stream) {
      console.log("Chunk text:", chunk.text);
      console.log("Function Calls:", chunk.functionCalls);
    }
  } catch (err: any) {
    console.error("ERROR:", err.message);
  }
}
main();
