
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { CodeInput } from './components/CodeInput';
import { ReportDisplay } from './components/ReportDisplay';
import { Spinner } from './components/Spinner';
import { reviewCode } from './services/geminiService';
import type { CodeReviewReport } from './types';

const App: React.FC = () => {
  const [reviewReport, setReviewReport] = useState<CodeReviewReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeCode = useCallback(async (code: string) => {
    setIsLoading(true);
    setError(null);
    setReviewReport(null);
    try {
      const report = await reviewCode(code);
      setReviewReport(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const WelcomeMessage: React.FC = () => (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 h-full flex flex-col justify-center items-center text-center">
        <div className="bg-gray-900/50 p-6 rounded-full mb-6">
            <svg className="h-16 w-16 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-100">AI-Powered Code Analysis</h2>
        <p className="mt-2 max-w-md text-gray-400">
            Paste your code or upload a file to get an instant, detailed review. Our AI will analyze readability, modularity, potential bugs, and provide suggestions for improvement.
        </p>
    </div>
  );

  const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-900/20 border border-red-500 text-red-300 rounded-xl shadow-2xl p-6 h-full flex flex-col justify-center items-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold mb-2">Analysis Failed</h3>
        <p className="text-sm text-red-300">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full" style={{minHeight: 'calc(100vh - 12rem)'}}>
                <div className="h-full">
                    <CodeInput onAnalyze={handleAnalyzeCode} isLoading={isLoading} />
                </div>
                <div className="h-full">
                    {isLoading && <Spinner />}
                    {error && <ErrorDisplay message={error} />}
                    {reviewReport && !isLoading && !error && <ReportDisplay report={reviewReport} />}
                    {!isLoading && !error && !reviewReport && <WelcomeMessage />}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
