
export interface CodeReviewReport {
  readability: string;
  modularity: string;
  potential_bugs: string;
  suggestions: string;
}

export type ReportCategory = keyof CodeReviewReport;
