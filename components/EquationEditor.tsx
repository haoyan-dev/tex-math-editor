'use client';

import { useState, useRef, useCallback } from 'react';
import { MATH_MODES, type MathMode } from '@/lib/constants';
import { wrapEquation, getFullEquation } from '@/lib/equationUtils';
import SymbolPalette from './SymbolPalette';

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

  const handleCopy = useCallback(() => {
    const fullEquation = getFullEquation(value, mathMode);
    navigator.clipboard.writeText(fullEquation).then(() => {
      onCopyEquation?.();
    });
  }, [value, mathMode, onCopyEquation]);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-gray-200 p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Math Mode
          </label>
          <div className="flex gap-2">
            {MATH_MODES.map((mode) => (
              <button
                key={mode.value}
                onClick={() => onMathModeChange(mode.value)}
                className={`px-4 py-2 text-sm font-medium rounded border transition-colors ${
                  mathMode === mode.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setShowSymbolPalette(!showSymbolPalette)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {showSymbolPalette ? 'Hide' : 'Show'} Symbol Palette
        </button>
      </div>

      {showSymbolPalette && <SymbolPalette onInsertSymbol={handleSymbolInsert} />}

      <div className="flex-1 flex flex-col p-4">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            LaTeX Equation
          </label>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded border border-blue-300"
          >
            Copy Equation
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInputChange}
          className="flex-1 w-full p-3 border border-gray-300 rounded font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter LaTeX equation (e.g., x = y + z)"
        />
        <p className="mt-2 text-xs text-gray-500">
          Type your equation here. It will be automatically wrapped with the selected math mode delimiters.
        </p>
      </div>
    </div>
  );
}

