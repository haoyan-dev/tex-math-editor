'use client';

import { useState, useEffect } from 'react';
import {
  DPI_PRESETS,
  SCALE_PRESETS,
  JPG_QUALITY_PRESETS,
  type FontOption,
  type MathMode,
  type SVGFormat,
  type DPIPreset,
  type ScalePreset,
  type JpgQualityPreset,
} from '@/lib/constants';
import { exportImage, copySVGCode, getSVGDimensions } from '@/lib/exportUtils';

interface ExportControlsProps {
  equation: string;
  mathMode: MathMode;
  font: FontOption;
  onCopySVG?: (copiedContent: string) => void;
}

export default function ExportControls({ equation, mathMode, font, onCopySVG }: ExportControlsProps) {
  const [activeTab, setActiveTab] = useState<'svg' | 'png' | 'jpg'>('svg');
  const [widthValue, setWidthValue] = useState<string>('');
  const [heightValue, setHeightValue] = useState<string>('');
  const [dpi, setDpi] = useState<DPIPreset>(300);
  const [scale, setScale] = useState<ScalePreset>(1);
  const [alphaChannel, setAlphaChannel] = useState<boolean>(false);
  const [quality, setQuality] = useState<JpgQualityPreset>(90);
  const [filename, setFilename] = useState<string>('eq');
  const [isExporting, setIsExporting] = useState(false);
  const [svgDimensions, setSvgDimensions] = useState<{ width: number; height: number } | null>(null);

  // Calculate SVG dimensions when equation or font changes
  useEffect(() => {
    if (equation.trim()) {
      getSVGDimensions(equation, mathMode, font)
        .then((dims) => {
          setSvgDimensions(dims);
        })
        .catch((error) => {
          console.error('Failed to get SVG dimensions:', error);
          setSvgDimensions(null);
        });
    } else {
      setSvgDimensions(null);
    }
  }, [equation, mathMode, font]);

  // Auto-populate PNG/JPG dimensions with 3x SVG dimensions when switching tabs
  // SVG dimensions are in em units (1em = 16px), so convert to pixels: em * 16 * 3
  useEffect(() => {
    if ((activeTab === 'png' || activeTab === 'jpg') && svgDimensions && !widthValue && !heightValue) {
      const EM = 16; // 1em = 16px
      const pixelsPerEm = EM;
      const scaleFactor = 3;
      setWidthValue((svgDimensions.width * pixelsPerEm * scaleFactor).toFixed(0));
      setHeightValue((svgDimensions.height * pixelsPerEm * scaleFactor).toFixed(0));
    }
  }, [activeTab, svgDimensions, widthValue, heightValue]);

  // Sanitize filename to remove invalid characters
  const sanitizeFilename = (name: string): string => {
    // Remove invalid filename characters: / \ : * ? " < > |
    return name.replace(/[\/\\:*?"<>|]/g, '').trim() || 'eq';
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const width = widthValue ? parseFloat(widthValue) : undefined;
      const height = heightValue ? parseFloat(heightValue) : undefined;
      const sanitizedFilename = sanitizeFilename(filename);
      
      await exportImage({
        equation,
        mathMode,
        format: activeTab,
        font,
        width,
        height,
        dpi: activeTab !== 'svg' ? dpi : undefined,
        scale: activeTab === 'svg' && scale !== 1 ? scale : undefined,
        alphaChannel: activeTab === 'png' ? alphaChannel : undefined,
        quality: activeTab === 'jpg' ? quality : undefined,
        filename: sanitizedFilename,
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

      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('svg')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-all duration-200 ${
              activeTab === 'svg'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            SVG
          </button>
          <button
            onClick={() => setActiveTab('png')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-all duration-200 ${
              activeTab === 'png'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            PNG
          </button>
          <button
            onClick={() => setActiveTab('jpg')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-all duration-200 ${
              activeTab === 'jpg'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            JPG
          </button>
        </div>
      </div>

      {/* SVG Tab Content */}
      {activeTab === 'svg' && (
        <>
          {/* Filename */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filename
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="eq"
              className="input-base w-full"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              Default: eq.svg
            </p>
          </div>

          {/* Scale presets */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Scale
            </label>
            <div className="flex gap-2 flex-wrap">
              {SCALE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setScale(preset.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-200 ${
                    scale === preset.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Export buttons */}
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
        </>
      )}

      {/* PNG Tab Content */}
      {activeTab === 'png' && (
        <>
          {/* Filename */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filename
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="eq"
              className="input-base w-full"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              Default: eq.png
            </p>
          </div>

          {/* Dimensions */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dimensions (px)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Width"
                value={widthValue}
                onChange={(e) => setWidthValue(e.target.value)}
                disabled
                className="input-base flex-1 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                step="1"
              />
              <input
                type="number"
                placeholder="Height"
                value={heightValue}
                onChange={(e) => setHeightValue(e.target.value)}
                disabled
                className="input-base flex-1 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                step="1"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-500">
              Default: 3x SVG dimensions ({svgDimensions ? `${Math.round(svgDimensions.width * 16 * 3)} × ${Math.round(svgDimensions.height * 16 * 3)}` : 'calculating...'})
            </p>
          </div>

          {/* Transparent background */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={alphaChannel}
                onChange={(e) => setAlphaChannel(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-gray-700">
                Transparent Background
              </span>
            </label>
          </div>

          {/* DPI presets */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              DPI
            </label>
            <div className="flex gap-2 flex-wrap">
              {DPI_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setDpi(preset.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-200 ${
                    dpi === preset.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Export button */}
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
              'Export as PNG'
            )}
          </button>
        </>
      )}

      {/* JPG Tab Content */}
      {activeTab === 'jpg' && (
        <>
          {/* Filename */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filename
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="eq"
              className="input-base w-full"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              Default: eq.jpg
            </p>
          </div>

          {/* Dimensions */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dimensions (px)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Width"
                value={widthValue}
                onChange={(e) => setWidthValue(e.target.value)}
                disabled
                className="input-base flex-1 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                step="1"
              />
              <input
                type="number"
                placeholder="Height"
                value={heightValue}
                onChange={(e) => setHeightValue(e.target.value)}
                disabled
                className="input-base flex-1 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                step="1"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-500">
              Default: 3x SVG dimensions ({svgDimensions ? `${Math.round(svgDimensions.width * 16 * 3)} × ${Math.round(svgDimensions.height * 16 * 3)}` : 'calculating...'})
            </p>
          </div>

          {/* Quality presets */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quality
            </label>
            <div className="flex gap-2 flex-wrap">
              {JPG_QUALITY_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setQuality(preset.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-200 ${
                    quality === preset.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* DPI presets */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              DPI
            </label>
            <div className="flex gap-2 flex-wrap">
              {DPI_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setDpi(preset.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-200 ${
                    dpi === preset.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Export button */}
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
              'Export as JPG'
            )}
          </button>
        </>
      )}
    </div>
  );
}
