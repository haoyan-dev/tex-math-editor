import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import type { FontOption } from "@/lib/constants";
import { configureMathJaxForServer } from "@/lib/mathjax-server-config";

// Type declarations for MathJax global object
declare global {
  var MathJax: {
    startup: {
      promise: Promise<void>;
      adaptor: {
        serializeXML: (node: any) => string;
        tags: (node: any, tag: string) => any[];
      };
    };
    tex2svgPromise: (
      math: string,
      options?: {
        display?: boolean;
        em?: number;
        ex?: number;
        containerWidth?: number;
      }
    ) => Promise<any>;
    done: () => void;
    config?: {
      output?: {
        font?: string;
      };
    };
  };
}

// Rendering constants
const EM = 16; // size of an em in pixels
const EX = 8; // size of an ex in pixels
const WIDTH = 80 * EM; // width of container for linebreaking

// Track if MathJax has been loaded
let mathJaxLoaded = false;
let mathJaxLoadPromise: Promise<void> | null = null;

/**
 * Ensure MathJax is loaded and ready
 * This function handles lazy loading of MathJax components
 */
async function ensureMathJaxLoaded(font: FontOption): Promise<void> {
  if (mathJaxLoaded && mathJaxLoadPromise) {
    return mathJaxLoadPromise;
  }

  if (!mathJaxLoadPromise) {
    mathJaxLoadPromise = (async () => {
      try {
        // Configure MathJax before loading components
        configureMathJaxForServer(font);

        // Load the tex-svg component using require at runtime
        // We construct the module path dynamically to prevent static analysis
        // Use the es5 export path which maps to bundle
        const modulePath = '@mathjax/src/es5/' + 'tex-svg.js';
        // Use Function constructor to create require call that can't be statically analyzed
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const dynamicRequire = new Function('path', 'return require(path)');
        dynamicRequire(modulePath);

        // Wait for MathJax to finish startup with timeout
        // Use Promise.race to prevent hanging if startup fails
        const startupPromise = global.MathJax?.startup?.promise;
        if (!startupPromise) {
          throw new Error('MathJax startup promise not available after loading');
        }

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('MathJax startup timeout')), 30000)
        );

        await Promise.race([startupPromise, timeoutPromise]);

        mathJaxLoaded = true;
      } catch (error) {
        // Reset on error to allow retry
        mathJaxLoaded = false;
        mathJaxLoadPromise = null;
        throw error;
      }
    })();
  }

  return mathJaxLoadPromise;
}

/**
 * Convert equation to SVG using MathJax
 */
async function convertEquationToSVG(
  equation: string,
  font: FontOption,
  display: boolean = true
): Promise<string> {
  // Ensure MathJax is loaded
  await ensureMathJaxLoaded(font);

  // Update font if needed (in case MathJax was already loaded with different font)
  if (global.MathJax?.startup) {
    const { mapFontNameToMathJaxV4 } = await import("@/lib/mathjax-config");
    const mathJaxFontName = mapFontNameToMathJaxV4(font);
    if (global.MathJax.config?.output?.font !== mathJaxFontName) {
      if (!global.MathJax.config) {
        global.MathJax.config = {};
      }
      if (!global.MathJax.config.output) {
        global.MathJax.config.output = {};
      }
      global.MathJax.config.output.font = mathJaxFontName;
    }
  }

  // Use promise-based rendering method
  const node = await global.MathJax.tex2svgPromise(equation, {
    display: display,
    em: EM,
    ex: EX,
    containerWidth: WIDTH,
  });

  // Serialize the SVG using the adaptor
  const adaptor = global.MathJax.startup.adaptor;
  const svgString = adaptor.serializeXML(adaptor.tags(node, "svg")[0]);

  return svgString;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      equation,
      format = "svg",
      font = "TeX",
      width,
      height,
      returnCode,
      svgFormat,
    } = body;

    if (!equation || typeof equation !== "string") {
      return NextResponse.json(
        { error: "Equation is required" },
        { status: 400 }
      );
    }

    // Convert equation to SVG
    let svgContent: string;
    try {
      svgContent = await convertEquationToSVG(equation, font, true);
    } catch (conversionError) {
      // If the error is related to font initialization, try with default font
      if (
        conversionError instanceof Error &&
        (conversionError.message.includes("x_height") ||
          conversionError.message.includes("Cannot read properties of undefined") ||
          conversionError.message.includes("font"))
      ) {
        console.warn(
          `Font "${font}" initialization failed, falling back to default v4 font.`,
          conversionError
        );
        try {
          // Fallback to default v4 font (mathjax-newcm)
          svgContent = await convertEquationToSVG(equation, "TeX", true);
        } catch (fallbackError) {
          console.error("MathJax conversion error with fallback font:", fallbackError);
          throw new Error(
            `Failed to export equation: Font initialization error. Please try a different font.`
          );
        }
      } else {
        console.error("MathJax conversion error:", conversionError);
        throw conversionError;
      }
    }

    // Apply dimensions if provided
    if (width || height) {
      svgContent = applyDimensions(svgContent, width, height);
    }

    if (format === "svg") {
      if (returnCode) {
        if (svgFormat === "document") {
          const svgDocument = createSVGDocument(svgContent);
          return new NextResponse(svgDocument, {
            headers: {
              "Content-Type": "text/plain",
            },
          });
        } else {
          // Return just the SVG element
          return new NextResponse(svgContent, {
            headers: {
              "Content-Type": "text/plain",
            },
          });
        }
      } else {
        // Return SVG file - remove x_height attributes for image export
        if (svgContent) {
          svgContent = removeXHeightAttributes(svgContent);
        }
        return new NextResponse(svgContent, {
          headers: {
            "Content-Type": "image/svg+xml",
            "Content-Disposition": 'attachment; filename="equation.svg"',
          },
        });
      }
    } else if (format === "png" || format === "jpg") {
      // Convert SVG to PNG/JPG using sharp - remove x_height attributes for image export
      if (svgContent) {
        svgContent = removeXHeightAttributes(svgContent);
      }
      const buffer = await convertSVGToImage(svgContent, format, width, height);
      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      const extension = format === "png" ? "png" : "jpg";

      return new NextResponse(buffer as unknown as BodyInit, {
        headers: {
          "Content-Type": mimeType,
          "Content-Disposition": `attachment; filename="equation.${extension}"`,
        },
      });
    } else {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }
  } catch (error) {
    console.error("Export error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to export equation";
    console.error(
      "Full error stack:",
      error instanceof Error ? error.stack : String(error)
    );
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  } finally {
    // Ensure MathJax workers are shut down to prevent hanging processes
    // This is important in v4 as workers prevent node applications from ending
    // Only call done() if MathJax was successfully initialized
    if (mathJaxLoaded && global.MathJax?.done) {
      try {
        global.MathJax.done();
        // Reset the loaded flag so MathJax can be reloaded if needed
        mathJaxLoaded = false;
        mathJaxLoadPromise = null;
      } catch (cleanupError) {
        console.warn("Error during MathJax cleanup:", cleanupError);
        // Reset flags even on error to allow retry
        mathJaxLoaded = false;
        mathJaxLoadPromise = null;
      }
    }
  }
}

function extractSVGFromContainer(htmlContent: string): string {
  // Extract SVG element from mjx-container wrapper
  const svgMatch = htmlContent.match(/<svg[^>]*>[\s\S]*?<\/svg>/i);
  if (svgMatch) {
    return svgMatch[0];
  }
  // Fallback: return original if no SVG found
  return htmlContent;
}

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

function removeXHeightAttributes(svgContent: string): string {
  // Remove x_height attributes in all variations (x_height, x-height, data-x-height)
  // Handle both double and single quotes, and attributes with space before or at tag start
  // Use more specific regex to avoid breaking SVG structure
  let cleaned = svgContent;

  // Remove attributes that appear after a space (most common case)
  cleaned = cleaned.replace(/\s+x_height\s*=\s*["'][^"']*["']/gi, "");
  cleaned = cleaned.replace(/\s+x-height\s*=\s*["'][^"']*["']/gi, "");
  cleaned = cleaned.replace(/\s+data-x-height\s*=\s*["'][^"']*["']/gi, "");

  // Remove attributes that appear at the start of attribute list (less common)
  cleaned = cleaned.replace(/(<[^>\s]+)\s+x_height\s*=\s*["'][^"']*["']/gi, "$1");
  cleaned = cleaned.replace(/(<[^>\s]+)\s+x-height\s*=\s*["'][^"']*["']/gi, "$1");
  cleaned = cleaned.replace(/(<[^>\s]+)\s+data-x-height\s*=\s*["'][^"']*["']/gi, "$1");

  return cleaned;
}

function createSVGDocument(svgContent: string): string {
  // Extract SVG element content (remove <svg> tags)
  const svgMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  const svgBody = svgMatch ? svgMatch[1] : svgContent;

  // Extract attributes from original SVG
  const attributesMatch = svgContent.match(/<svg([^>]*)>/);
  const attributes = attributesMatch ? attributesMatch[1] : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg${attributes}>
${svgBody}
</svg>`;
}

async function convertSVGToImage(
  svgContent: string,
  format: "png" | "jpg",
  width?: number,
  height?: number
): Promise<Buffer> {
  try {
    let pipeline = sharp(Buffer.from(svgContent), {
      density: 300, // High DPI for better quality
    });

    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    if (format === "png") {
      return pipeline.png().toBuffer();
    } else {
      return pipeline.jpeg({ quality: 90 }).toBuffer();
    }
  } catch (sharpError) {
    console.error("Sharp conversion error:", sharpError);
    throw sharpError;
  }
}
