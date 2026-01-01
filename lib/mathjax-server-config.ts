import type { FontOption } from "./constants";
import { mapFontNameToMathJaxV4 } from "./mathjax-config";

// TeX packages configuration
// In MathJax v4, AllPackages may not be available
// Use a comprehensive default set of packages that covers most use cases
const DEFAULT_TEX_PACKAGES = [
  "base",
  "ams",
  "newcommand",
  "noundefined",
  "require",
  "autoload",
  "configmacros",
  "tagformat",
  "amsCd",
  "bbox",
  "boldsymbol",
  "braket",
  "bussproofs",
  "cancel",
  "centernot",
  "color",
  "colortbl",
  "empheq",
  "enclose",
  "extpfeil",
  "gensymb",
  "mathtools",
  "mhchem",
  "physics",
  "upgreek",
  "unicode",
  "verb",
];

/**
 * Get TeX packages for MathJax configuration
 */
export function getTexPackages(): string[] {
  return DEFAULT_TEX_PACKAGES;
}

/**
 * Configure global MathJax for server-side use in Node.js
 * This sets up the configuration before loading MathJax components
 */
export function configureMathJaxForServer(font: FontOption = "TeX"): void {
  const mathJaxFontName = mapFontNameToMathJaxV4(font);

  // Configure global MathJax object for Node.js environment
  // This must be set before loading MathJax components
  (global as any).MathJax = {
    loader: {
      // Set path to bundle directory for server-side use
      // The bundle directory contains the combined components
      paths: { mathjax: "@mathjax/src/bundle" },
      // Load liteDOM adaptor for Node.js (lightweight DOM implementation)
      load: ["adaptors/liteDOM"],
      // Use import() for ES modules
      require: (file: string) => import(file),
    },
    // Output configuration
    output: {
      font: mathJaxFontName,
      linebreaks: {
        inline: false,
      },
    },
    // TeX input configuration
    tex: {
      packages: getTexPackages(),
      inlineMath: [["\\(", "\\)"]],
      displayMath: [["\\[", "\\]"]],
      processEscapes: true,
      processEnvironments: true,
    },
  };
}

/**
 * Update MathJax configuration with a new font
 * This can be called after MathJax is loaded to change the font
 */
export function updateMathJaxFont(font: FontOption): void {
  const mathJaxFontName = mapFontNameToMathJaxV4(font);
  if ((global as any).MathJax?.config) {
    if (!(global as any).MathJax.config.output) {
      (global as any).MathJax.config.output = {};
    }
    (global as any).MathJax.config.output.font = mathJaxFontName;
  }
}
