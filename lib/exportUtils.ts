import type { ExportFormat, FontOption, MathMode, SVGFormat } from './constants';
import { getFullEquation, unwrapEquation } from './equationUtils';
import { mapFontNameToMathJaxV4 } from './mathjax-config';

interface ExportImageOptions {
  equation: string;
  mathMode: MathMode;
  format: ExportFormat;
  font?: FontOption;
  width?: number;
  height?: number;
  dpi?: number;
  scale?: number;
  alphaChannel?: boolean;
  quality?: number;
  filename?: string;
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
      const options: {
        display?: boolean;
        em?: number;
        ex?: number;
        containerWidth?: number;
      } = {
        display: display,
        em: EM,
        ex: EX,
      };
      
      // For display mode, use containerWidth for line breaking
      // For inline mode, use a very large width to prevent unwanted wrapping
      // Inline math should stay on one line
      if (display) {
        options.containerWidth = WIDTH;
      } else {
        options.containerWidth = 10000 * EM;
      }
      
      const node = await window.MathJax.tex2svgPromise(equation, options);

      // Export the entire mjx-container (or the node itself) to preserve multi-line layout
      // The node from tex2svgPromise is typically an mjx-container element
      const serializer = new XMLSerializer();
      return serializer.serializeToString(node);
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

    // Find the mjx-container element in the rendered output
    const mjxContainer = container.querySelector('mjx-container');
    if (!mjxContainer) {
      throw new Error('MathJax did not render the equation');
    }

    // Clone the mjx-container to avoid modifying the original
    const mjxClone = mjxContainer.cloneNode(true) as Element;
    
    // Serialize the entire mjx-container to preserve multi-line layout
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(mjxClone);

    return svgString;
  } finally {
    // Clean up the temporary container
    document.body.removeChild(container);
  }
}

/**
 * Extract SVG element from mjx-container string
 * Returns the SVG content if the input is mjx-container, otherwise returns the input as-is
 */
function extractSVGFromMjxContainer(content: string): string {
  // Check if content contains mjx-container
  if (content.includes('<mjx-container')) {
    // Try to parse and extract SVG element
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const mjxContainer = doc.querySelector('mjx-container');
    
    if (mjxContainer) {
      // Find SVG element within mjx-container
      const svgElement = mjxContainer.querySelector('svg');
      if (svgElement) {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(svgElement);
      }
    }
    
    // Fallback: try regex extraction
    const svgMatch = content.match(/<svg[^>]*>[\s\S]*?<\/svg>/i);
    if (svgMatch) {
      return svgMatch[0];
    }
  }
  
  // If no mjx-container found, return as-is (might already be SVG)
  return content;
}

/**
 * Extract width and height from SVG content string
 * Returns dimensions with numeric values and units preserved
 */
function extractSVGDimensions(svgContent: string): { width: number; height: number; widthUnit?: string; heightUnit?: string } | null {
  // Try to get width and height attributes first
  const widthMatch = svgContent.match(/width\s*=\s*["']([^"']+)["']/i);
  const heightMatch = svgContent.match(/height\s*=\s*["']([^"']+)["']/i);
  
  if (widthMatch && heightMatch) {
    const widthValue = widthMatch[1];
    const heightValue = heightMatch[1];
    
    // Extract numeric value and unit separately
    const widthNumMatch = widthValue.match(/^([\d.]+)(.*)$/);
    const heightNumMatch = heightValue.match(/^([\d.]+)(.*)$/);
    
    if (widthNumMatch && heightNumMatch) {
      const widthPx = parseFloat(widthNumMatch[1]);
      const heightPx = parseFloat(heightNumMatch[1]);
      const widthUnit = widthNumMatch[2] || '';
      const heightUnit = heightNumMatch[2] || '';
      
      if (!isNaN(widthPx) && !isNaN(heightPx)) {
        return { width: widthPx, height: heightPx, widthUnit, heightUnit };
      }
    }
  }
  
  // Fallback to viewBox if width/height not present or invalid
  const viewBoxMatch = svgContent.match(/viewBox\s*=\s*["']([^"']+)["']/i);
  if (viewBoxMatch) {
    const viewBoxValues = viewBoxMatch[1].split(/\s+/).map(v => parseFloat(v));
    if (viewBoxValues.length >= 4 && !viewBoxValues.some(isNaN)) {
      // viewBox values don't have units, so no unit preserved
      return { width: viewBoxValues[2], height: viewBoxValues[3] };
    }
  }
  
  return null;
}

/**
 * Apply dimensions to SVG string
 */
function applyDimensions(
  svgContent: string,
  width?: number | string,
  height?: number | string
): string {
  let newSvg = svgContent;

  if (width !== undefined) {
    const widthValue = typeof width === 'string' ? width : String(width);
    newSvg = newSvg.replace(/width="[^"]*"/, `width="${widthValue}"`);
  }
  if (height !== undefined) {
    const heightValue = typeof height === 'string' ? height : String(height);
    newSvg = newSvg.replace(/height="[^"]*"/, `height="${heightValue}"`);
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
 * Get SVG dimensions from rendered equation
 * Returns dimensions in em units (based on EM = 16px = 1em)
 */
export async function getSVGDimensions(
  equation: string,
  mathMode: MathMode,
  font: FontOption
): Promise<{ width: number; height: number }> {
  // Unwrap equation to get raw content (MathJax will use display parameter to determine mode)
  const rawEquation = unwrapEquation(equation, mathMode);
  const display = mathMode !== 'inline';
  
  // Render equation to SVG with raw content and display parameter
  let svgContent = await renderEquationToSVG(rawEquation, font, display);
  
  // Extract SVG from mjx-container if needed (for dimension extraction)
  svgContent = extractSVGFromMjxContainer(svgContent);
  
  // Parse SVG to extract dimensions
  // Try to get width and height attributes first
  const widthMatch = svgContent.match(/width\s*=\s*["']([^"']+)["']/i);
  const heightMatch = svgContent.match(/height\s*=\s*["']([^"']+)["']/i);
  
  let widthPx: number;
  let heightPx: number;
  
  if (widthMatch && heightMatch) {
    // Extract numeric values (handle units like px, pt, etc.)
    const widthStr = widthMatch[1].replace(/[^\d.]/g, '');
    const heightStr = heightMatch[1].replace(/[^\d.]/g, '');
    widthPx = parseFloat(widthStr) || 0;
    heightPx = parseFloat(heightStr) || 0;
  } else {
    // Fallback to viewBox if width/height not present
    const viewBoxMatch = svgContent.match(/viewBox\s*=\s*["']([^"']+)["']/i);
    if (viewBoxMatch) {
      const viewBoxValues = viewBoxMatch[1].split(/\s+/).map(v => parseFloat(v));
      if (viewBoxValues.length >= 4) {
        widthPx = viewBoxValues[2];
        heightPx = viewBoxValues[3];
      } else {
        throw new Error('Unable to extract dimensions from SVG');
      }
    } else {
      // Last resort: try to get from bounding box by rendering to DOM
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
      const svgElement = svgDoc.querySelector('svg');
      if (svgElement) {
        // Create a temporary SVG element to measure
        const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        tempSvg.innerHTML = svgElement.innerHTML;
        tempSvg.setAttribute('style', 'position: absolute; visibility: hidden;');
        document.body.appendChild(tempSvg);
        const bbox = tempSvg.getBBox();
        widthPx = bbox.width;
        heightPx = bbox.height;
        document.body.removeChild(tempSvg);
      } else {
        throw new Error('Unable to extract dimensions from SVG');
      }
    }
  }
  
  // Convert pixel dimensions to em units (EM = 16px = 1em)
  const widthEm = widthPx / EM;
  const heightEm = heightPx / EM;
  
  return { width: widthEm, height: heightEm };
}

/**
 * Convert SVG string to canvas element
 */
async function svgToCanvas(
  svgString: string,
  width?: number,
  height?: number,
  dpi?: number,
  scale?: number,
  alphaChannel?: boolean
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Calculate base canvas dimensions
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

      // Apply scale if provided
      if (scale && scale !== 1) {
        canvasWidth = canvasWidth * scale;
        canvasHeight = canvasHeight * scale;
      }

      // Apply DPI scaling if provided (for raster formats)
      // DPI scaling: multiply by (dpi / 96) where 96 is standard screen DPI
      if (dpi && dpi !== 96) {
        const dpiScale = dpi / 96;
        canvasWidth = canvasWidth * dpiScale;
        canvasHeight = canvasHeight * dpiScale;
      }

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      // Always use alpha context for proper rendering, but fill with white if alphaChannel is false
      const ctx = canvas.getContext('2d', { alpha: true });

      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Draw background only if alpha channel is disabled
      if (!alphaChannel) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }

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
function canvasToBlob(canvas: HTMLCanvasElement, format: 'png' | 'jpg', quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    // Use provided quality for JPG, or default to 0.9 if not provided
    const jpgQuality = format === 'jpg' ? (quality !== undefined ? quality / 100 : 0.9) : undefined;

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error(`Failed to convert canvas to ${format}`));
        }
      },
      mimeType,
      jpgQuality
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
  const { 
    equation, 
    mathMode, 
    format, 
    font = 'TeX', 
    width, 
    height,
    dpi,
    scale,
    alphaChannel,
    quality,
    filename = 'eq'
  } = options;
  
  // Unwrap equation to get raw content (MathJax will use display parameter to determine mode)
  const rawEquation = unwrapEquation(equation, mathMode);

  try {
    // Determine display mode based on math mode
    const display = mathMode !== 'inline';

    // Render equation to SVG with raw content and display parameter
    let svgContent = await renderEquationToSVG(rawEquation, font, display);

    // Calculate effective dimensions: apply scale to base dimensions
    let effectiveWidth: number | string | undefined = width;
    let effectiveHeight: number | string | undefined = height;
    
    // For SVG format, if scale is provided but width/height are not,
    // extract current SVG dimensions and apply scale to them
    if (format === 'svg' && scale && scale !== 1 && !effectiveWidth && !effectiveHeight) {
      // Extract SVG from mjx-container for dimension extraction
      const svgForDims = extractSVGFromMjxContainer(svgContent);
      const currentDims = extractSVGDimensions(svgForDims);
      if (currentDims) {
        const scaledWidth = currentDims.width * scale;
        const scaledHeight = currentDims.height * scale;
        // Preserve units if they existed in the original
        effectiveWidth = currentDims.widthUnit ? `${scaledWidth}${currentDims.widthUnit}` : scaledWidth;
        effectiveHeight = currentDims.heightUnit ? `${scaledHeight}${currentDims.heightUnit}` : scaledHeight;
      }
    } else if (scale && scale !== 1) {
      if (effectiveWidth) effectiveWidth = (effectiveWidth as number) * scale;
      if (effectiveHeight) effectiveHeight = (effectiveHeight as number) * scale;
    }

    // Apply dimensions if provided
    if (effectiveWidth !== undefined || effectiveHeight !== undefined) {
      svgContent = applyDimensions(svgContent, effectiveWidth, effectiveHeight);
    }

    if (format === 'svg') {
      // For SVG format, export mjx-container directly (preserves multi-line layout)
      // Remove x_height attributes for image export
      svgContent = removeXHeightAttributes(svgContent);
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      downloadBlob(blob, `${filename}.svg`);
    } else if (format === 'png' || format === 'jpg') {
      // For PNG/JPG, extract SVG from mjx-container (canvas needs pure SVG)
      let pureSvg = extractSVGFromMjxContainer(svgContent);
      
      // Remove x_height attributes for image export
      pureSvg = removeXHeightAttributes(pureSvg);
      
      // Convert SVG to canvas, then to blob
      // Note: DPI and scale are applied in svgToCanvas
      const canvas = await svgToCanvas(
        pureSvg, 
        width, 
        height, 
        dpi, 
        scale, 
        format === 'png' ? alphaChannel : false
      );
      const blob = await canvasToBlob(canvas, format, quality);
      const extension = format === 'png' ? 'png' : 'jpg';
      downloadBlob(blob, `${filename}.${extension}`);
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
  
  // Unwrap equation to get raw content (MathJax will use display parameter to determine mode)
  const rawEquation = unwrapEquation(equation, mathMode);

  try {
    // Determine display mode based on math mode
    const display = mathMode !== 'inline';

    // Render equation to SVG with raw content and display parameter
    let svgContent = await renderEquationToSVG(rawEquation, font, display);

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

