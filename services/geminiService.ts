
import { GoogleGenAI, Type } from "@google/genai";
import { PROMPT_TEMPLATE } from '../constants';
import type { CodeReviewReport } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    readability: {
      type: Type.STRING,
      description: 'Detailed observations about code readability.',
    },
    modularity: {
      type: Type.STRING,
      description: 'Assessment of modular structure and reusability.',
    },
    potential_bugs: {
      type: Type.STRING,
      description: 'Any possible errors, inefficiencies, or risky patterns.',
    },
    suggestions: {
      type: Type.STRING,
      description: 'Actionable improvements following best coding practices.',
    },
  },
  required: ['readability', 'modularity', 'potential_bugs', 'suggestions'],
};

export async function reviewCode(code: string): Promise<CodeReviewReport> {
  try {
    const fullPrompt = `${PROMPT_TEMPLATE}\n\`\`\`\n${code}\n\`\`\``;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
        maxOutputTokens: 2000,
      }
    });

    const jsonString = response.text.trim();
    
    const cleanedJsonString = jsonString.replace(/^```json\n?/, '').replace(/\n?```$/, '');

    const report: CodeReviewReport = JSON.parse(cleanedJsonString);
    return report;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get code review from AI: ${error.message}`);
    }
    throw new Error('An unknown error occurred while analyzing the code.');
  }
}
