import type { FontOption } from './constants';

/**
 * Map user-facing font names to MathJax v4 font names
 * Using the default v4 font (mathjax-newcm)
 */
export function mapFontNameToMathJaxV4(font: FontOption): string {
  return 'mathjax-newcm';
}

/**
 * Get MathJax configuration for client-side rendering
 */
export function getMathJaxConfig(font: FontOption = 'TeX') {
  const mathJaxFontName = mapFontNameToMathJaxV4(font);
  return {
    tex: {
      inlineMath: [['\\(', '\\)']],
      displayMath: [['\\[', '\\]']],
      processEscapes: true,
      processEnvironments: true,
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
    },
    svg: {
      fontCache: 'global',
      font: mathJaxFontName,
    },
  };
}

/**
 * Get MathJax Node.js configuration for server-side rendering
 */
export function getMathJaxNodeConfig(font: FontOption = 'TeX') {
  return {
    tex: {
      inlineMath: [['\\(', '\\)']],
      displayMath: [['\\[', '\\]']],
      processEscapes: true,
      processEnvironments: true,
    },
    svg: {
      font: font,
      fontCache: 'none',
    },
  };
}
