'use client';

import { useState } from 'react';
import { SYMBOL_CATEGORIES } from '@/lib/constants';

interface SymbolPaletteProps {
  onInsertSymbol: (symbol: string) => void;
}

export default function SymbolPalette({ onInsertSymbol }: SymbolPaletteProps) {
  const [activeTab, setActiveTab] = useState(0);

  const handleSymbolClick = (latex: string) => {
    onInsertSymbol(latex);
  };

  return (
    <div className="border-b border-gray-200 bg-white shadow-sm">
      <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50/50">
        {SYMBOL_CATEGORIES.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
              activeTab === index
                ? 'border-blue-500 text-blue-600 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-white/50'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="p-4 max-h-64 overflow-y-auto bg-white">
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
          {SYMBOL_CATEGORIES[activeTab].symbols.map((symbol, index) => (
            <button
              key={index}
              onClick={() => handleSymbolClick(symbol.latex)}
              className="p-2.5 text-center border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 hover:shadow-sm active:scale-95 transition-all duration-150 bg-white"
              title={symbol.latex}
            >
              <span className="text-lg font-medium">{symbol.label || symbol.latex}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

