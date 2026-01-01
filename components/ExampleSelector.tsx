'use client';

import { useState } from 'react';
import { getExamplesByCategory, getCategories } from '@/lib/equationExamples';

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

  const handleClose = () => {
    setIsOpen(false);
    setSelectedCategory(null);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-6 top-6 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 group"
          aria-label="Equation Examples"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-6 py-5 rounded-t-2xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h2 className="text-2xl font-bold text-blue-700">
                    Equation Examples
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                  aria-label="Close"
                >
                  <svg
                    className="w-6 h-6"
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
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-white">
              {selectedCategory ? (
                <div>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="w-full px-6 py-3 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 transition-colors duration-150 font-medium"
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
                        className="w-full px-6 py-3.5 text-left hover:bg-blue-50 transition-all duration-150 group border-l-2 border-transparent hover:border-blue-400"
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
                      className="w-full px-6 py-3.5 text-left hover:bg-gray-50 flex items-center justify-between group transition-all duration-150 border-l-2 border-transparent hover:border-gray-300"
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

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl flex-shrink-0">
              <button
                onClick={handleClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-150 shadow-md hover:shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

