'use client';

import { useState } from 'react';
import { EXPORT_FORMATS, SMALL_WIDTH, MEDIUM_WIDTH, LARGE_WIDTH, type ExportFormat, type FontOption, type MathMode, type SVGFormat } from '@/lib/constants';
import { exportImage, copySVGCode } from '@/lib/exportUtils';

interface ExportControlsProps {
  equation: string;
  mathMode: MathMode;
  font: FontOption;
  onCopySVG?: (copiedContent: string) => void;
}

export default function ExportControls({ equation, mathMode, font, onCopySVG }: ExportControlsProps) {
  const [format, setFormat] = useState<ExportFormat>('svg');
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [customWidth, setCustomWidth] = useState<string>('');
  const [customHeight, setCustomHeight] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  const handlePresetSize = (presetWidth: number) => {
    setWidth(presetWidth);
    setHeight(undefined);
    setCustomWidth('');
    setCustomHeight('');
  };

  const handleCustomDimensions = () => {
    const w = customWidth ? parseInt(customWidth) : undefined;
    const h = customHeight ? parseInt(customHeight) : undefined;
    setWidth(w);
    setHeight(h);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportImage({
        equation,
        mathMode,
        format,
        font,
        width,
        height,
      });
    } catch (error) {
      alert('Failed to export: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopySVG = async (svgFormat: SVGFormat) => {
    try {
      const svgCode = await copySVGCode({
        equation,
        mathMode,
        font,
        svgFormat,
      });
      onCopySVG?.(svgCode);
    } catch (error) {
      alert('Failed to copy SVG: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-gradient-to-br from-white to-gray-50">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
      </h3>

      {/* Format selection */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Format
        </label>
        <div className="flex gap-2 flex-wrap">
          {EXPORT_FORMATS.map((fmt) => (
            <button
              key={fmt.value}
              onClick={() => setFormat(fmt.value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                format === fmt.value
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dimension controls */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Dimensions
        </label>
        <div className="flex gap-2 mb-2 flex-wrap">
          <button
            onClick={() => handlePresetSize(SMALL_WIDTH)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-200 ${
              width === SMALL_WIDTH
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
            }`}
          >
            Small ({SMALL_WIDTH}px)
          </button>
          <button
            onClick={() => handlePresetSize(MEDIUM_WIDTH)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-200 ${
              width === MEDIUM_WIDTH
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
            }`}
          >
            Medium ({MEDIUM_WIDTH}px)
          </button>
          <button
            onClick={() => handlePresetSize(LARGE_WIDTH)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-200 ${
              width === LARGE_WIDTH
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
            }`}
          >
            Large ({LARGE_WIDTH}px)
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Width (px)"
            value={customWidth}
            onChange={(e) => setCustomWidth(e.target.value)}
            onBlur={handleCustomDimensions}
            className="input-base flex-1"
          />
          <input
            type="number"
            placeholder="Height (px)"
            value={customHeight}
            onChange={(e) => setCustomHeight(e.target.value)}
            onBlur={handleCustomDimensions}
            className="input-base flex-1"
          />
        </div>
        <p className="mt-1.5 text-xs text-gray-500">Leave empty for auto-size</p>
      </div>

      {/* Export buttons */}
      {format === 'svg' ? (
        <div className="flex flex-col gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn-primary w-full"
          >
            {isExporting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download SVG
              </span>
            )}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleCopySVG('element')}
              className="btn-secondary flex-1"
            >
              Copy SVG Element
            </button>
            <button
              onClick={() => handleCopySVG('document')}
              className="btn-secondary flex-1"
            >
              Copy SVG Document
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="btn-primary w-full"
        >
          {isExporting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting...
            </span>
          ) : (
            `Export as ${format.toUpperCase()}`
          )}
        </button>
      )}
    </div>
  );
}

