'use client';

import { useState } from 'react';
import { DEFAULT_FONT, type FontOption, type MathMode } from '@/lib/constants';
import { wrapEquation } from '@/lib/equationUtils';
import EquationEditor from '@/components/EquationEditor';
import EquationPreview from '@/components/EquationPreview';
import FontSelector from '@/components/FontSelector';
import ExportControls from '@/components/ExportControls';
import CopyNotificationModal from '@/components/CopyNotificationModal';

export default function Home() {
  const [equation, setEquation] = useState('');
  const [mathMode, setMathMode] = useState<MathMode>('equation');
  const [font, setFont] = useState<FontOption>(DEFAULT_FONT);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copiedContent, setCopiedContent] = useState('');
  const [modalTitle, setModalTitle] = useState('Copied to Clipboard!');

  const wrappedEquation = wrapEquation(equation, mathMode);

  const handleCopyEquation = (content: string) => {
    setCopiedContent(content);
    setModalTitle('Equation Copied to Clipboard!');
    setShowCopyModal(true);
  };

  const handleCopySVG = (content: string) => {
    setCopiedContent(content);
    setModalTitle('SVG Code Copied to Clipboard!');
    setShowCopyModal(true);
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
              onCopySVG={handleCopySVG}
            />
          </div>
        </div>
      </div>

      <CopyNotificationModal
        isOpen={showCopyModal}
        copiedContent={copiedContent}
        title={modalTitle}
        onClose={() => setShowCopyModal(false)}
      />
    </div>
  );
}
