'use client';

import { useState } from 'react';
import { EXPORT_FORMATS, SMALL_WIDTH, MEDIUM_WIDTH, LARGE_WIDTH, type ExportFormat, type FontOption, type MathMode, type SVGFormat } from '@/lib/constants';
import { exportImage, copySVGCode } from '@/lib/exportUtils';

interface ExportControlsProps {
  equation: string;
  mathMode: MathMode;
  font: FontOption;
}

export default function ExportControls({ equation, mathMode, font }: ExportControlsProps) {
  const [format, setFormat] = useState<ExportFormat>('svg');
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [customWidth, setCustomWidth] = useState<string>('');
  const [customHeight, setCustomHeight] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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
      await copySVGCode({
        equation,
        mathMode,
        font,
        svgFormat,
      });
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      alert('Failed to copy SVG: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <h3 className="text-lg font-semibold mb-4">Export</h3>

      {/* Format selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Format
        </label>
        <div className="flex gap-2">
          {EXPORT_FORMATS.map((fmt) => (
            <button
              key={fmt.value}
              onClick={() => setFormat(fmt.value)}
              className={`px-4 py-2 text-sm font-medium rounded border transition-colors ${
                format === fmt.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dimension controls */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dimensions
        </label>
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => handlePresetSize(SMALL_WIDTH)}
            className={`px-3 py-1 text-sm rounded border ${
              width === SMALL_WIDTH
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Small ({SMALL_WIDTH}px)
          </button>
          <button
            onClick={() => handlePresetSize(MEDIUM_WIDTH)}
            className={`px-3 py-1 text-sm rounded border ${
              width === MEDIUM_WIDTH
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Medium ({MEDIUM_WIDTH}px)
          </button>
          <button
            onClick={() => handlePresetSize(LARGE_WIDTH)}
            className={`px-3 py-1 text-sm rounded border ${
              width === LARGE_WIDTH
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
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
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Height (px)"
            value={customHeight}
            onChange={(e) => setCustomHeight(e.target.value)}
            onBlur={handleCustomDimensions}
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Leave empty for auto-size</p>
      </div>

      {/* Export buttons */}
      {format === 'svg' ? (
        <div className="flex flex-col gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? 'Exporting...' : 'Download SVG'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleCopySVG('element')}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Copy SVG Element
            </button>
            <button
              onClick={() => handleCopySVG('document')}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Copy SVG Document
            </button>
          </div>
          {copySuccess && (
            <p className="text-sm text-green-600">Copied to clipboard!</p>
          )}
        </div>
      ) : (
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
        </button>
      )}
    </div>
  );
}

