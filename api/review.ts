// Vercel serverless function: POST /api/review  { code: string } -> CodeReviewReport
import { handleReviewRequest } from "../server/review";

export function POST(request: Request): Promise<Response> {
  return handleReviewRequest(request);
}
