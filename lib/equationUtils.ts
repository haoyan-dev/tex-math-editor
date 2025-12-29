import type { MathMode } from './constants';

/**
 * Wrap user input with appropriate LaTeX delimiters based on math mode
 */
export function wrapEquation(input: string, mode: MathMode): string {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return '';
  }

  // Check if input is already wrapped
  if (isAlreadyWrapped(trimmed, mode)) {
    return trimmed;
  }

  switch (mode) {
    case 'equation':
      return `\\begin{equation}${trimmed}\\end{equation}`;
    case 'inline':
      return `\\(${trimmed}\\)`;
    case 'display':
      return `\\[${trimmed}\\]`;
    default:
      return trimmed;
  }
}

/**
 * Check if input is already wrapped with the current mode's delimiters
 */
function isAlreadyWrapped(input: string, mode: MathMode): boolean {
  switch (mode) {
    case 'equation':
      return input.startsWith('\\begin{equation}') && input.endsWith('\\end{equation}');
    case 'inline':
      return input.startsWith('\\(') && input.endsWith('\\)');
    case 'display':
      return input.startsWith('\\[') && input.endsWith('\\]');
    default:
      return false;
  }
}

/**
 * Get full equation with wrapper for copying/export
 */
export function getFullEquation(input: string, mode: MathMode): string {
  return wrapEquation(input, mode);
}

/**
 * Extract the raw equation content from wrapped equation
 */
export function unwrapEquation(wrapped: string, mode: MathMode): string {
  switch (mode) {
    case 'equation':
      if (wrapped.startsWith('\\begin{equation}') && wrapped.endsWith('\\end{equation}')) {
        return wrapped
          .slice('\\begin{equation}'.length)
          .slice(0, -'\\end{equation}'.length)
          .trim();
      }
      break;
    case 'inline':
      if (wrapped.startsWith('\\(') && wrapped.endsWith('\\)')) {
        return wrapped.slice(2, -2).trim();
      }
      break;
    case 'display':
      if (wrapped.startsWith('\\[') && wrapped.endsWith('\\]')) {
        return wrapped.slice(2, -2).trim();
      }
      break;
  }
  return wrapped;
}

