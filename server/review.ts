// Server-only: runs in the Vite dev server and in the /api/review function.
// The Gemini key is read from the server environment and never reaches the browser.
import { GoogleGenAI, Type } from "@google/genai";
import { PROMPT_TEMPLATE } from "../constants";
import type { CodeReviewReport } from "../types";

export const MAX_CODE_CHARS = 100_000;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    readability: { type: Type.STRING, description: "Detailed observations about code readability." },
    modularity: { type: Type.STRING, description: "Assessment of modular structure and reusability." },
    potential_bugs: { type: Type.STRING, description: "Any possible errors, inefficiencies, or risky patterns." },
    suggestions: { type: Type.STRING, description: "Actionable improvements following best coding practices." },
  },
  required: ["readability", "modularity", "potential_bugs", "suggestions"],
};

export class ReviewError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function runReview(code: unknown): Promise<CodeReviewReport> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new ReviewError("GEMINI_API_KEY is not set on the server.", 500);
  if (typeof code !== "string" || !code.trim()) throw new ReviewError("Request body must include non-empty 'code'.", 400);
  if (code.length > MAX_CODE_CHARS) throw new ReviewError(`Code is too long (max ${MAX_CODE_CHARS} characters).`, 413);

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: `${PROMPT_TEMPLATE}\n\`\`\`\n${code}\n\`\`\``,
    config: {
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.5,
      maxOutputTokens: 2000,
    },
  });

  const text = (response.text ?? "").trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(text) as CodeReviewReport;
}

// Shared request handler (Web Request/Response), used by Vercel and the dev server.
export async function handleReviewRequest(request: Request): Promise<Response> {
  if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });
  try {
    const body = await request.json().catch(() => ({}));
    const report = await runReview((body as { code?: unknown }).code);
    return Response.json(report);
  } catch (err) {
    const status = err instanceof ReviewError ? err.status : 502;
    // Client errors are safe to echo; upstream (Gemini) errors are logged, not exposed.
    const message = err instanceof ReviewError ? err.message : "The AI review request failed. Please try again.";
    if (status >= 500) console.error("Review failed:", err);
    return Response.json({ error: message }, { status });
  }
}
