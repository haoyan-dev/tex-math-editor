import { NextRequest, NextResponse } from "next/server";
import { mathjax } from "mathjax-full/js/mathjax.js";
import { TeX } from "mathjax-full/js/input/tex.js";
import { SVG } from "mathjax-full/js/output/svg.js";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js";
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages.js";
import sharp from "sharp";
import type { FontOption } from "@/lib/constants";

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

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

    // Create TeX input
    const tex = new TeX({
      packages: AllPackages,
      inlineMath: [["\\(", "\\)"]],
      displayMath: [["\\[", "\\]"]],
      processEscapes: true,
      processEnvironments: true,
    });

    // Create SVG output with font configuration
    // Use default TeX font to avoid font loading issues
    const svgOptions: any = {
      fontCache: "none",
    };

    // Only set font if it's not the default TeX
    if (font && font !== "TeX") {
      svgOptions.font = font;
    }

    const svg = new SVG(svgOptions);

    // Create document
    const html = mathjax.document("", {
      InputJax: tex,
      OutputJax: svg,
    });

    // Convert equation - this should work with proper font initialization
    const node = html.convert(equation, { display: true });
    let svgContent = extractSVGFromContainer(adaptor.outerHTML(node));

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
        // Return SVG file
        return new NextResponse(svgContent, {
          headers: {
            "Content-Type": "image/svg+xml",
            "Content-Disposition": 'attachment; filename="equation.svg"',
          },
        });
      }
    } else if (format === "png" || format === "jpg") {
      // Convert SVG to PNG/JPG using sharp
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
}
