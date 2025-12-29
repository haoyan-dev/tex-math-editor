'use client';

import { useState } from 'react';
import { EQUATION_EXAMPLES, getExamplesByCategory, getCategories } from '@/lib/equationExamples';

interface ExampleSelectorProps {
  onSelectExample: (latex: string) => void;
}

export default function ExampleSelector({ onSelectExample }: ExampleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = getCategories();
  const examplesByCategory = getExamplesByCategory();

  const handleExampleClick = (latex: string) => {
    onSelectExample(latex);
    setIsOpen(false);
    setSelectedCategory(null);
  };

  if (!isOpen) {
    return (
      <div className="border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 shadow-sm">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-gray-100/50 flex items-center justify-between transition-colors duration-150 group"
        >
          <span className="font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Equation Examples
          </span>
          <svg
            className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 bg-white shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-white to-gray-50">
        <span className="font-semibold text-sm text-gray-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Equation Examples
        </span>
        <button
          onClick={() => {
            setIsOpen(false);
            setSelectedCategory(null);
          }}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded p-1 transition-colors duration-150"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto bg-white">
        {selectedCategory ? (
          <div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 transition-colors duration-150 font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Categories
            </button>
            <div className="divide-y divide-gray-100">
              {examplesByCategory[selectedCategory].map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example.latex)}
                  className="w-full px-4 py-3.5 text-left hover:bg-blue-50 transition-all duration-150 group border-l-2 border-transparent hover:border-blue-400"
                >
                  <div className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                    {example.name}
                  </div>
                  {example.description && (
                    <div className="text-xs text-gray-500 mt-1.5">
                      {example.description}
                    </div>
                  )}
                  <div className="text-xs font-mono text-gray-700 mt-2.5 bg-gray-50 p-2.5 rounded-lg break-all border border-gray-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                    {example.latex}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="w-full px-4 py-3.5 text-left hover:bg-gray-50 flex items-center justify-between group transition-all duration-150 border-l-2 border-transparent hover:border-gray-300"
              >
                <div>
                  <div className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {examplesByCategory[category].length} example
                    {examplesByCategory[category].length !== 1 ? 's' : ''}
                  </div>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

