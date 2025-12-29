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
    <div className="flex h-screen flex-col bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">LaTeX Math Equation Editor</h1>
        <p className="text-sm text-gray-600 mt-1">
          Self-hosted equation editor - Export to SVG for vector design tools
        </p>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Editor */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <FontSelector value={font} onChange={setFont} />
          </div>
          <div className="flex-1 overflow-hidden">
            <EquationEditor
              value={equation}
              mathMode={mathMode}
              onChange={setEquation}
              onMathModeChange={setMathMode}
              onCopyEquation={handleCopyEquation}
            />
          </div>
          {copySuccess && (
            <div className="bg-green-50 border-t border-green-200 p-2">
              <p className="text-sm text-green-600 text-center">Equation copied to clipboard!</p>
            </div>
          )}
        </div>

        {/* Right Panel - Preview and Export */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 border-b border-gray-200 overflow-hidden">
            <div className="h-full bg-white">
              <EquationPreview equation={wrappedEquation} font={font} />
            </div>
          </div>
          <div className="overflow-auto">
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
