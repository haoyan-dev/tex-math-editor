import type { ExportFormat, FontOption, MathMode, SVGFormat } from './constants';
import { getFullEquation } from './equationUtils';
import { mapFontNameToMathJaxV4 } from './mathjax-config';

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

// Type declarations for MathJax in browser
declare global {
  interface Window {
    MathJax?: {
      tex2svgPromise: (
        math: string,
        options?: {
          display?: boolean;
          em?: number;
          ex?: number;
          containerWidth?: number;
        }
      ) => Promise<HTMLElement>;
      typesetPromise: (elements?: HTMLElement[]) => Promise<void>;
      startup?: {
        ready: () => void;
      };
      config?: {
        tex?: {
          inlineMath?: string[][];
          displayMath?: string[][];
        };
        output?: {
          font?: string;
        };
      };
    };
  }
}

// Rendering constants
const EM = 16; // size of an em in pixels
const EX = 8; // size of an ex in pixels
const WIDTH = 80 * EM; // width of container for linebreaking

/**
 * Ensure MathJax is loaded and ready in the browser
 */
async function ensureMathJaxReady(): Promise<void> {
  // Check if MathJax is already loaded
  if (window.MathJax && window.MathJax.tex2svgPromise) {
    return;
  }

  // If MathJax script is loading, wait for it
  if (!window.MathJax) {
    // Check if script is already in the document
    const existingScript = document.querySelector('script[src*="mathjax"]');
    if (existingScript) {
      // Wait for script to load
      await new Promise<void>((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (window.MathJax && window.MathJax.tex2svgPromise) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 50);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('MathJax failed to load within timeout'));
        }, 10000);
      });
    } else {
      throw new Error('MathJax is not loaded. Please ensure MathJax is loaded before exporting.');
    }
  }

  // Ensure tex2svgPromise is available
  if (!window.MathJax?.tex2svgPromise) {
    throw new Error('MathJax tex2svgPromise API is not available. Please ensure MathJax v4 is loaded.');
  }
}

/**
 * Render equation to SVG using client-side MathJax
 */
async function renderEquationToSVG(
  equation: string,
  font: FontOption,
  display: boolean = true
): Promise<string> {
  await ensureMathJaxReady();

  if (!window.MathJax) {
    throw new Error('MathJax is not available');
  }

  // Update font configuration if needed
  const mathJaxFontName = mapFontNameToMathJaxV4(font);
  if (window.MathJax.config) {
    if (!window.MathJax.config.output) {
      window.MathJax.config.output = {};
    }
    window.MathJax.config.output.font = mathJaxFontName;
  }

  // Try tex2svgPromise first (if available in browser MathJax v4)
  if (window.MathJax.tex2svgPromise) {
    try {
      const node = await window.MathJax.tex2svgPromise(equation, {
        display: display,
        em: EM,
        ex: EX,
        containerWidth: WIDTH,
      });

      // Extract SVG element from MathJax output
      const svgElement = node.querySelector('svg');
      if (svgElement) {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(svgElement);
      }
    } catch (error) {
      console.warn('tex2svgPromise failed, falling back to DOM method:', error);
    }
  }

  // Fallback: Use DOM-based approach (more compatible with browser MathJax v4)
  // Create a temporary container element
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.visibility = 'hidden';
  
  // Set the equation text (it should already be wrapped with delimiters from getFullEquation)
  container.textContent = equation;

  document.body.appendChild(container);

  try {
    // Typeset the equation
    await window.MathJax.typesetPromise([container]);

    // Find the SVG element in the rendered output
    const mjxContainer = container.querySelector('mjx-container');
    if (!mjxContainer) {
      throw new Error('MathJax did not render the equation');
    }

    const svgElement = mjxContainer.querySelector('svg');
    if (!svgElement) {
      throw new Error('SVG element not found in MathJax output');
    }

    // Clone the SVG to avoid modifying the original
    const svgClone = svgElement.cloneNode(true) as SVGElement;
    
    // Serialize to string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);

    return svgString;
  } finally {
    // Clean up the temporary container
    document.body.removeChild(container);
  }
}

/**
 * Apply dimensions to SVG string
 */
function applyDimensions(
  svgContent: string,
  width?: number,
  height?: number
): string {
  let newSvg = svgContent;

  if (width) {
    newSvg = newSvg.replace(/width="[^"]*"/, `width="${width}"`);
  }
  if (height) {
    newSvg = newSvg.replace(/height="[^"]*"/, `height="${height}"`);
  }

  return newSvg;
}

/**
 * Remove x_height attributes from SVG (for image export compatibility)
 */
function removeXHeightAttributes(svgContent: string): string {
  let cleaned = svgContent;
  cleaned = cleaned.replace(/\s+x_height\s*=\s*["'][^"']*["']/gi, '');
  cleaned = cleaned.replace(/\s+x-height\s*=\s*["'][^"']*["']/gi, '');
  cleaned = cleaned.replace(/\s+data-x-height\s*=\s*["'][^"']*["']/gi, '');
  cleaned = cleaned.replace(/(<[^>\s]+)\s+x_height\s*=\s*["'][^"']*["']/gi, '$1');
  cleaned = cleaned.replace(/(<[^>\s]+)\s+x-height\s*=\s*["'][^"']*["']/gi, '$1');
  cleaned = cleaned.replace(/(<[^>\s]+)\s+data-x-height\s*=\s*["'][^"']*["']/gi, '$1');
  return cleaned;
}

/**
 * Create SVG document from SVG element
 */
function createSVGDocument(svgContent: string): string {
  const svgMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  const svgBody = svgMatch ? svgMatch[1] : svgContent;
  const attributesMatch = svgContent.match(/<svg([^>]*)>/);
  const attributes = attributesMatch ? attributesMatch[1] : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg${attributes}>
${svgBody}
</svg>`;
}

/**
 * Convert SVG string to canvas element
 */
async function svgToCanvas(
  svgString: string,
  width?: number,
  height?: number
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Calculate canvas dimensions
      let canvasWidth = img.width;
      let canvasHeight = img.height;

      if (width || height) {
        if (width && height) {
          canvasWidth = width;
          canvasHeight = height;
        } else if (width) {
          const aspectRatio = img.height / img.width;
          canvasWidth = width;
          canvasHeight = width * aspectRatio;
        } else if (height) {
          const aspectRatio = img.width / img.height;
          canvasWidth = height * aspectRatio;
          canvasHeight = height;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Draw white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw SVG image
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      URL.revokeObjectURL(url);
      resolve(canvas);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG image'));
    };

    img.src = url;
  });
}

/**
 * Convert canvas to blob
 */
function canvasToBlob(canvas: HTMLCanvasElement, format: 'png' | 'jpg'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = format === 'jpg' ? 0.9 : undefined;

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error(`Failed to convert canvas to ${format}`));
        }
      },
      mimeType,
      quality
    );
  });
}

/**
 * Download blob as file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/**
 * Export equation as image file
 */
export async function exportImage(options: ExportImageOptions): Promise<void> {
  const { equation, mathMode, format, font = 'TeX', width, height } = options;
  const fullEquation = getFullEquation(equation, mathMode);

  try {
    // Determine display mode based on math mode
    const display = mathMode !== 'inline';

    // Render equation to SVG
    let svgContent = await renderEquationToSVG(fullEquation, font, display);

    // Apply dimensions if provided
    if (width || height) {
      svgContent = applyDimensions(svgContent, width, height);
    }

    // Remove x_height attributes for image export
    svgContent = removeXHeightAttributes(svgContent);

    if (format === 'svg') {
      // Export SVG directly
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      downloadBlob(blob, 'equation.svg');
    } else if (format === 'png' || format === 'jpg') {
      // Convert SVG to canvas, then to blob
      const canvas = await svgToCanvas(svgContent, width, height);
      const blob = await canvasToBlob(canvas, format);
      const extension = format === 'png' ? 'png' : 'jpg';
      downloadBlob(blob, `equation.${extension}`);
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
}

/**
 * Copy SVG code to clipboard
 */
export async function copySVGCode(options: CopySVGOptions): Promise<string> {
  const { equation, mathMode, font = 'TeX', svgFormat } = options;
  const fullEquation = getFullEquation(equation, mathMode);

  try {
    // Determine display mode based on math mode
    const display = mathMode !== 'inline';

    // Render equation to SVG
    let svgContent = await renderEquationToSVG(fullEquation, font, display);

    // Format SVG based on requested format
    if (svgFormat === 'document') {
      svgContent = createSVGDocument(svgContent);
    }

    // Copy to clipboard
    await navigator.clipboard.writeText(svgContent);
    return svgContent;
  } catch (error) {
    console.error('Copy SVG error:', error);
    throw error;
  }
}

