import type { ExportFormat, FontOption, MathMode, SVGFormat } from './constants';
import { getFullEquation } from './equationUtils';

interface ExportImageOptions {
  equation: string;
  mathMode: MathMode;
  format: ExportFormat;
  font?: FontOption;
  width?: number;
  height?: number;
}

interface CopySVGOptions {
  equation: string;
  mathMode: MathMode;
  font?: FontOption;
  svgFormat: SVGFormat;
}

/**
 * Export equation as image file
 */
export async function exportImage(options: ExportImageOptions): Promise<void> {
  const { equation, mathMode, format, font = 'TeX', width, height } = options;
  const fullEquation = getFullEquation(equation, mathMode);

  try {
    const response = await fetch('/api/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        equation: fullEquation,
        format,
        font,
        width,
        height,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to export image');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `equation.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
}

/**
 * Copy SVG code to clipboard
 */
export async function copySVGCode(options: CopySVGOptions): Promise<void> {
  const { equation, mathMode, font = 'TeX', svgFormat } = options;
  const fullEquation = getFullEquation(equation, mathMode);

  try {
    const response = await fetch('/api/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        equation: fullEquation,
        format: 'svg',
        font,
        returnCode: true,
        svgFormat,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get SVG code');
    }

    const svgCode = await response.text();
    await navigator.clipboard.writeText(svgCode);
  } catch (error) {
    console.error('Copy SVG error:', error);
    throw error;
  }
}

