'use client';

import { useEffect, useRef } from 'react';
import type { FontOption } from '@/lib/constants';
import { mapFontNameToMathJaxV4 } from '@/lib/mathjax-config';

interface EquationPreviewProps {
  equation: string;
  font?: FontOption;
}

declare global {
  interface Window {
    MathJax?: {
      typesetPromise: (elements?: HTMLElement[]) => Promise<void>;
      startup?: {
        ready: () => void;
      };
      config?: any;
    };
  }
}

export default function EquationPreview({ equation, font = 'TeX' }: EquationPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mathJaxLoadedRef = useRef(false);
  const equationTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load MathJax from CDN (only once)
    if (!window.MathJax) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@4/tex-svg.js';
      script.async = true;
      script.onload = () => {
        if (window.MathJax) {
          // Set initial configuration with current font
          // Map user-facing font name to MathJax v4 font name
          const mathJaxFontName = mapFontNameToMathJaxV4(font);
          window.MathJax.config = {
            tex: {
              inlineMath: [['\\(', '\\)']],
              displayMath: [['\\[', '\\]']],
              processEscapes: true,
              processEnvironments: true,
            },
            output: {
              font: mathJaxFontName,
            },
            svg: {
              fontCache: 'global',
            },
          };
          mathJaxLoadedRef.current = true;
          if (containerRef.current && equation) {
            window.MathJax.typesetPromise([containerRef.current]).catch((err) => {
              console.error('MathJax typeset error:', err);
            });
          }
        }
      };
      document.head.appendChild(script);
    } else {
      mathJaxLoadedRef.current = true;
    }
  }, []);

  useEffect(() => {
    // Re-typeset when equation or font changes
    if (window.MathJax && containerRef.current && equation && mathJaxLoadedRef.current) {
      // Update font config BEFORE typesetting
      // Map user-facing font name to MathJax v4 font name
      if (window.MathJax.config) {
        const mathJaxFontName = mapFontNameToMathJaxV4(font);
        // In v4, font is configured in the output block
        if (!window.MathJax.config.output) {
          window.MathJax.config.output = {};
        }
        window.MathJax.config.output.font = mathJaxFontName;
      }
      
      // Use requestAnimationFrame to ensure React has finished rendering
      // before MathJax processes the content
      requestAnimationFrame(() => {
        if (window.MathJax && containerRef.current && equation && equationTextRef.current) {
          // Clear only MathJax-generated elements, not the equation text element
          const mjxContainers = containerRef.current.querySelectorAll('mjx-container');
          mjxContainers.forEach(container => container.remove());
          
          // Ensure the equation text is present and set correctly
          // (React's key prop should have already updated it, but ensure it's correct)
          if (equationTextRef.current.textContent !== equation) {
            equationTextRef.current.textContent = equation;
          }
          
          // Re-typeset with the new font configuration
          // MathJax will use the updated font from config
          window.MathJax.typesetPromise([containerRef.current]).catch((err) => {
            console.error('MathJax typeset error:', err);
          });
        }
      });
    } else if (window.MathJax && containerRef.current && !equation && mathJaxLoadedRef.current) {
      // Clear the container when equation is empty
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    }
  }, [equation, font]);

  if (!equation.trim()) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-medium">Preview will appear here</p>
          <p className="text-xs text-gray-400 mt-1">Start typing an equation to see the preview</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <div 
        key={`${font}-${equation}`}
        ref={equationTextRef}
        className="flex items-center justify-center min-h-full py-4"
      >
        {equation}
      </div>
    </div>
  );
}
