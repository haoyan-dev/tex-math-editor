'use client';

import { useEffect, useRef } from 'react';
import type { FontOption } from '@/lib/constants';

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

  useEffect(() => {
    // Load MathJax from CDN
    if (!window.MathJax) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
      script.async = true;
      script.onload = () => {
        if (window.MathJax) {
          window.MathJax.config = {
            tex: {
              inlineMath: [['\\(', '\\)']],
              displayMath: [['\\[', '\\]']],
              processEscapes: true,
              processEnvironments: true,
            },
            svg: {
              fontCache: 'global',
              font: font,
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
      // Update font config if changed
      if (window.MathJax.config) {
        window.MathJax.config.svg = {
          ...window.MathJax.config.svg,
          font: font,
        };
      }
      window.MathJax.typesetPromise([containerRef.current]).catch((err) => {
        console.error('MathJax typeset error:', err);
      });
    }
  }, [equation, font]);

  if (!equation.trim()) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        <p>Preview will appear here</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto p-6 bg-gray-50"
    >
      <div>{equation}</div>
    </div>
  );
}
