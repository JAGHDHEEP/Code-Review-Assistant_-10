
import React, { useState, useCallback } from 'react';

interface CodeInputProps {
  onAnalyze: (code: string) => void;
  isLoading: boolean;
}

export const CodeInput: React.FC<CodeInputProps> = ({ onAnalyze, isLoading }) => {
  const [code, setCode] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCode(text);
        setFileName(file.name);
      };
      reader.readAsText(file);
      event.target.value = ''; // Reset file input
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (code.trim()) {
      onAnalyze(code);
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Submit Your Code</h2>
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <div className="mb-4 flex-grow relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="w-full h-full p-4 bg-gray-900/70 border-2 border-gray-700 rounded-lg text-gray-300 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <label htmlFor="file-upload" className="cursor-pointer relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500">
            <span>{fileName ? `Loaded: ${fileName}` : 'Upload File'}</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={isLoading} />
          </label>
          
          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Analyze Code'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
