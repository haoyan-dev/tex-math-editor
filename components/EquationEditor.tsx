'use client';

import { useState, useRef, useCallback } from 'react';
import { MATH_MODES, type MathMode } from '@/lib/constants';
import { wrapEquation, getFullEquation } from '@/lib/equationUtils';
import SymbolPalette from './SymbolPalette';
import ExampleSelector from './ExampleSelector';

interface EquationEditorProps {
  value: string;
  mathMode: MathMode;
  onChange: (value: string) => void;
  onMathModeChange: (mode: MathMode) => void;
  onCopyEquation?: () => void;
}

export default function EquationEditor({
  value,
  mathMode,
  onChange,
  onMathModeChange,
  onCopyEquation,
}: EquationEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showSymbolPalette, setShowSymbolPalette] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleSymbolInsert = useCallback(
    (symbol: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = value;
      const newValue = currentValue.slice(0, start) + symbol + currentValue.slice(end);

      onChange(newValue);

      // Restore cursor position after insertion
      setTimeout(() => {
        if (textarea) {
          const newPosition = start + symbol.length;
          textarea.setSelectionRange(newPosition, newPosition);
          textarea.focus();
        }
      }, 0);
    },
    [value, onChange]
  );

  const handleExampleSelect = useCallback(
    (latex: string) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        onChange(latex);
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = value;
      const newValue = currentValue.slice(0, start) + latex + currentValue.slice(end);

      onChange(newValue);

      // Restore cursor position after insertion
      setTimeout(() => {
        if (textarea) {
          const newPosition = start + latex.length;
          textarea.setSelectionRange(newPosition, newPosition);
          textarea.focus();
        }
      }, 0);
    },
    [value, onChange]
  );

  const handleCopy = useCallback(() => {
    const fullEquation = getFullEquation(value, mathMode);
    navigator.clipboard.writeText(fullEquation).then(() => {
      onCopyEquation?.();
    });
  }, [value, mathMode, onCopyEquation]);

  return (
    <div className="flex h-full flex-col bg-white overflow-hidden">
      <ExampleSelector onSelectExample={handleExampleSelect} />
      <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-white to-gray-50 flex-shrink-0">
        <div className="mb-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Math Mode
          </label>
          <div className="flex gap-2">
            {MATH_MODES.map((mode) => (
              <button
                key={mode.value}
                onClick={() => onMathModeChange(mode.value)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  mathMode === mode.value
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setShowSymbolPalette(!showSymbolPalette)}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showSymbolPalette ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
          </svg>
          {showSymbolPalette ? 'Hide' : 'Show'} Symbol Palette
        </button>
      </div>

      {showSymbolPalette && (
        <div className="flex-shrink-0">
          <SymbolPalette onInsertSymbol={handleSymbolInsert} />
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-0 p-4">
        <div className="mb-2 flex items-center justify-between flex-shrink-0">
          <label className="text-sm font-semibold text-gray-700">
            LaTeX Equation
          </label>
          <button
            onClick={handleCopy}
            className="btn-ghost text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <svg className="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Equation
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInputChange}
          className="flex-1 w-full min-h-0 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-150"
          placeholder="Enter LaTeX equation (e.g., x = y + z)"
        />
        <p className="mt-2 text-xs text-gray-500 leading-relaxed flex-shrink-0">
          Type your equation here. It will be automatically wrapped with the selected math mode delimiters.
        </p>
      </div>
    </div>
  );
}

