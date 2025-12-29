// Dimension presets
export const SMALL_WIDTH = 400;
export const MEDIUM_WIDTH = 800;
export const LARGE_WIDTH = 1200;

// Math mode types
export type MathMode = 'equation' | 'inline' | 'display';

export const MATH_MODES: { value: MathMode; label: string }[] = [
  { value: 'equation', label: 'Equation' },
  { value: 'inline', label: 'Inline' },
  { value: 'display', label: 'Display' },
];

// Font options
export type FontOption = 'TeX' | 'STIX' | 'Asana-Math' | 'Latin-Modern' | 'Computer-Modern' | 'Neo-Euler' | 'Gyre-Pagella' | 'Gyre-Termes';

export const FONT_OPTIONS: { value: FontOption; label: string }[] = [
  { value: 'TeX', label: 'TeX (Default)' },
  { value: 'STIX', label: 'STIX' },
  { value: 'Asana-Math', label: 'Asana Math' },
  { value: 'Latin-Modern', label: 'Latin Modern' },
  { value: 'Computer-Modern', label: 'Computer Modern' },
  { value: 'Neo-Euler', label: 'Neo Euler' },
  { value: 'Gyre-Pagella', label: 'Gyre Pagella' },
  { value: 'Gyre-Termes', label: 'Gyre Termes' },
];

export const DEFAULT_FONT: FontOption = 'TeX';

// Export formats
export type ExportFormat = 'svg' | 'png' | 'jpg';

export const EXPORT_FORMATS: { value: ExportFormat; label: string }[] = [
  { value: 'svg', label: 'SVG' },
  { value: 'png', label: 'PNG' },
  { value: 'jpg', label: 'JPG' },
];

// SVG format types
export type SVGFormat = 'element' | 'document';

// Symbol palette data
export type SymbolCategory = {
  name: string;
  symbols: Array<{ latex: string; label?: string }>;
};

export const SYMBOL_CATEGORIES: SymbolCategory[] = [
  {
    name: 'Operators',
    symbols: [
      { latex: '+', label: '+' },
      { latex: '-', label: '-' },
      { latex: '\\times', label: '×' },
      { latex: '\\div', label: '÷' },
      { latex: '\\pm', label: '±' },
      { latex: '\\mp', label: '∓' },
      { latex: '\\cdot', label: '·' },
      { latex: '\\ast', label: '*' },
      { latex: '\\star', label: '⋆' },
      { latex: '\\circ', label: '∘' },
      { latex: '\\bullet', label: '•' },
    ],
  },
  {
    name: 'Relations',
    symbols: [
      { latex: '=', label: '=' },
      { latex: '\\neq', label: '≠' },
      { latex: '\\approx', label: '≈' },
      { latex: '\\sim', label: '∼' },
      { latex: '\\equiv', label: '≡' },
      { latex: '\\leq', label: '≤' },
      { latex: '\\geq', label: '≥' },
      { latex: '\\ll', label: '≪' },
      { latex: '\\gg', label: '≫' },
      { latex: '\\propto', label: '∝' },
      { latex: '\\cong', label: '≅' },
      { latex: '<', label: '<' },
      { latex: '>', label: '>' },
    ],
  },
  {
    name: 'Set Operations',
    symbols: [
      { latex: '\\in', label: '∈' },
      { latex: '\\notin', label: '∉' },
      { latex: '\\subset', label: '⊂' },
      { latex: '\\supset', label: '⊃' },
      { latex: '\\cup', label: '∪' },
      { latex: '\\cap', label: '∩' },
      { latex: '\\emptyset', label: '∅' },
      { latex: '\\forall', label: '∀' },
      { latex: '\\exists', label: '∃' },
      { latex: '\\not\\exists', label: '∄' },
    ],
  },
  {
    name: 'Arrows',
    symbols: [
      { latex: '\\rightarrow', label: '→' },
      { latex: '\\leftarrow', label: '←' },
      { latex: '\\leftrightarrow', label: '↔' },
      { latex: '\\Rightarrow', label: '⇒' },
      { latex: '\\Leftarrow', label: '⇐' },
      { latex: '\\Leftrightarrow', label: '⇔' },
      { latex: '\\mapsto', label: '↦' },
      { latex: '\\to', label: '→' },
      { latex: '\\gets', label: '←' },
    ],
  },
  {
    name: 'Greek (lowercase)',
    symbols: [
      { latex: '\\alpha', label: 'α' },
      { latex: '\\beta', label: 'β' },
      { latex: '\\gamma', label: 'γ' },
      { latex: '\\delta', label: 'δ' },
      { latex: '\\epsilon', label: 'ε' },
      { latex: '\\varepsilon', label: 'ε' },
      { latex: '\\zeta', label: 'ζ' },
      { latex: '\\eta', label: 'η' },
      { latex: '\\theta', label: 'θ' },
      { latex: '\\vartheta', label: 'ϑ' },
      { latex: '\\iota', label: 'ι' },
      { latex: '\\kappa', label: 'κ' },
      { latex: '\\lambda', label: 'λ' },
      { latex: '\\mu', label: 'μ' },
      { latex: '\\nu', label: 'ν' },
      { latex: '\\xi', label: 'ξ' },
      { latex: '\\pi', label: 'π' },
      { latex: '\\varpi', label: 'ϖ' },
      { latex: '\\rho', label: 'ρ' },
      { latex: '\\varrho', label: 'ϱ' },
      { latex: '\\sigma', label: 'σ' },
      { latex: '\\varsigma', label: 'ς' },
      { latex: '\\tau', label: 'τ' },
      { latex: '\\upsilon', label: 'υ' },
      { latex: '\\phi', label: 'φ' },
      { latex: '\\varphi', label: 'φ' },
      { latex: '\\chi', label: 'χ' },
      { latex: '\\psi', label: 'ψ' },
      { latex: '\\omega', label: 'ω' },
    ],
  },
  {
    name: 'Greek (uppercase)',
    symbols: [
      { latex: '\\Alpha', label: 'Α' },
      { latex: '\\Beta', label: 'Β' },
      { latex: '\\Gamma', label: 'Γ' },
      { latex: '\\Delta', label: 'Δ' },
      { latex: '\\Epsilon', label: 'Ε' },
      { latex: '\\Zeta', label: 'Ζ' },
      { latex: '\\Eta', label: 'Η' },
      { latex: '\\Theta', label: 'Θ' },
      { latex: '\\Iota', label: 'Ι' },
      { latex: '\\Kappa', label: 'Κ' },
      { latex: '\\Lambda', label: 'Λ' },
      { latex: '\\Mu', label: 'Μ' },
      { latex: '\\Nu', label: 'Ν' },
      { latex: '\\Xi', label: 'Ξ' },
      { latex: '\\Pi', label: 'Π' },
      { latex: '\\Rho', label: 'Ρ' },
      { latex: '\\Sigma', label: 'Σ' },
      { latex: '\\Tau', label: 'Τ' },
      { latex: '\\Upsilon', label: 'Υ' },
      { latex: '\\Phi', label: 'Φ' },
      { latex: '\\Chi', label: 'Χ' },
      { latex: '\\Psi', label: 'Ψ' },
      { latex: '\\Omega', label: 'Ω' },
    ],
  },
  {
    name: 'Functions',
    symbols: [
      { latex: '\\sin', label: 'sin' },
      { latex: '\\cos', label: 'cos' },
      { latex: '\\tan', label: 'tan' },
      { latex: '\\sec', label: 'sec' },
      { latex: '\\csc', label: 'csc' },
      { latex: '\\cot', label: 'cot' },
      { latex: '\\log', label: 'log' },
      { latex: '\\ln', label: 'ln' },
      { latex: '\\exp', label: 'exp' },
      { latex: '\\max', label: 'max' },
      { latex: '\\min', label: 'min' },
      { latex: '\\lim', label: 'lim' },
      { latex: '\\sup', label: 'sup' },
      { latex: '\\inf', label: 'inf' },
      { latex: '\\sum', label: '∑' },
      { latex: '\\prod', label: '∏' },
      { latex: '\\int', label: '∫' },
      { latex: '\\oint', label: '∮' },
    ],
  },
  {
    name: 'Brackets',
    symbols: [
      { latex: '\\left(', label: '(' },
      { latex: '\\right)', label: ')' },
      { latex: '\\left[', label: '[' },
      { latex: '\\right]', label: ']' },
      { latex: '\\left\\{', label: '{' },
      { latex: '\\right\\}', label: '}' },
      { latex: '\\langle', label: '⟨' },
      { latex: '\\rangle', label: '⟩' },
      { latex: '\\left|', label: '|' },
      { latex: '\\right|', label: '|' },
    ],
  },
  {
    name: 'Fractions & Roots',
    symbols: [
      { latex: '\\frac{}{}', label: 'Fraction' },
      { latex: '\\sqrt{}', label: '√' },
      { latex: '\\sqrt[]{}', label: 'nth root' },
    ],
  },
  {
    name: 'Accents',
    symbols: [
      { latex: '\\hat{}', label: 'hat' },
      { latex: '\\bar{}', label: 'bar' },
      { latex: '\\dot{}', label: 'dot' },
      { latex: '\\ddot{}', label: 'ddot' },
      { latex: '\\vec{}', label: 'vec' },
      { latex: '\\tilde{}', label: 'tilde' },
      { latex: '\\acute{}', label: 'acute' },
      { latex: '\\grave{}', label: 'grave' },
    ],
  },
];

