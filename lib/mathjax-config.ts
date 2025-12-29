import type { FontOption } from './constants';

/**
 * Get MathJax configuration for client-side rendering
 */
export function getMathJaxConfig(font: FontOption = 'TeX') {
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
      font: font,
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
