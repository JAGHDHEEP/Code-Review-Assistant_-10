import type { CodeReviewReport } from '../types';

// Calls our own backend (/api/review), which holds the Gemini key server-side.
export async function reviewCode(code: string): Promise<CodeReviewReport> {
  const res = await fetch('/api/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Failed to get code review from AI: ${data.error ?? res.statusText}`);
  }
  return data as CodeReviewReport;
}
