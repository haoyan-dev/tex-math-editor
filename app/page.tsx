'use client';

import { useState } from 'react';
import { DEFAULT_FONT, type FontOption, type MathMode } from '@/lib/constants';
import { wrapEquation } from '@/lib/equationUtils';
import EquationEditor from '@/components/EquationEditor';
import EquationPreview from '@/components/EquationPreview';
import FontSelector from '@/components/FontSelector';
import ExportControls from '@/components/ExportControls';

export default function Home() {
  const [equation, setEquation] = useState('');
  const [mathMode, setMathMode] = useState<MathMode>('equation');
  const [font, setFont] = useState<FontOption>(DEFAULT_FONT);
  const [copySuccess, setCopySuccess] = useState(false);

  const wrappedEquation = wrapEquation(equation, mathMode);

  const handleCopyEquation = () => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm px-6 py-5">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          LaTeX Math Equation Editor
        </h1>
        <p className="text-sm text-gray-600 mt-1.5">
          Self-hosted equation editor - Export to SVG for vector design tools
        </p>
      </header>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Panel - Editor */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col bg-white shadow-sm min-w-0">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 flex-shrink-0">
            <FontSelector value={font} onChange={setFont} />
          </div>
          <div className="flex-1 overflow-hidden min-h-0">
            <EquationEditor
              value={equation}
              mathMode={mathMode}
              onChange={setEquation}
              onMathModeChange={setMathMode}
              onCopyEquation={handleCopyEquation}
            />
          </div>
          {copySuccess && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200 p-2.5 shadow-inner flex-shrink-0">
              <p className="text-sm text-green-700 text-center font-medium flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Equation copied to clipboard!
              </p>
            </div>
          )}
        </div>

        {/* Right Panel - Preview and Export */}
        <div className="w-1/2 flex flex-col bg-white min-w-0">
          <div className="flex-1 border-b border-gray-200 overflow-hidden shadow-inner min-h-0">
            <EquationPreview equation={wrappedEquation} font={font} />
          </div>
          <div className="overflow-auto border-t border-gray-200 shadow-lg flex-shrink-0">
            <ExportControls
              equation={equation}
              mathMode={mathMode}
              font={font}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
