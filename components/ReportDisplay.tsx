
import React, { useState, useMemo } from 'react';
import type { CodeReviewReport, ReportCategory } from '../types';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { PuzzleIcon } from './icons/PuzzleIcon';
import { BugIcon } from './icons/BugIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';

interface ReportDisplayProps {
  report: CodeReviewReport;
}

const categoryDetails: Record<ReportCategory, { label: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; description: string; }> = {
  readability: { label: 'Readability', icon: BookOpenIcon, description: 'Analysis of code clarity, naming, comments, and style.' },
  modularity: { label: 'Modularity', icon: PuzzleIcon, description: 'Assessment of structure, reusability, and separation of concerns.' },
  potential_bugs: { label: 'Potential Bugs', icon: BugIcon, description: 'Identification of possible errors, inefficiencies, or risky patterns.' },
  suggestions: { label: 'Suggestions', icon: LightBulbIcon, description: 'Actionable improvements based on best practices and optimizations.' },
};

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report }) => {
  const [activeTab, setActiveTab] = useState<ReportCategory>('readability');

  const categories = useMemo(() => Object.keys(report) as ReportCategory[], [report]);

  const handleDownload = () => {
    const jsonString = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code_review_report.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-200">Review Report</h2>
            <button
                onClick={handleDownload}
                className="inline-flex items-center px-3 py-1.5 border border-gray-600 text-xs font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 transition duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Report
            </button>
        </div>
      
      <div className="mb-4 border-b border-gray-700">
        <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
          {categories.map((category) => {
            const details = categoryDetails[category];
            const isActive = activeTab === category;
            return (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200 ${
                  isActive
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                <details.icon className={`mr-2 h-5 w-5 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`} />
                {details.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex-grow overflow-y-auto pr-2">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">{categoryDetails[activeTab].label}</h3>
        <p className="text-sm text-gray-400 mb-4">{categoryDetails[activeTab].description}</p>
        <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap font-sans">
          {report[activeTab]}
        </div>
      </div>
    </div>
  );
};
