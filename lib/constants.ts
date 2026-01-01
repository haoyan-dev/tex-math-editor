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
export type FontOption = 'TeX';

export const FONT_OPTIONS: { value: FontOption; label: string }[] = [
  { value: 'TeX', label: 'TeX (Default)' },
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

// DPI presets for export
export type DPIPreset = 150 | 300 | 600 | 1200;

export const DPI_PRESETS: { value: DPIPreset; label: string }[] = [
  { value: 150, label: '150 DPI' },
  { value: 300, label: '300 DPI' },
  { value: 600, label: '600 DPI' },
  { value: 1200, label: '1200 DPI' },
];

// Scale presets
export type ScalePreset = 0.5 | 1 | 2 | 3;

export const SCALE_PRESETS: { value: ScalePreset; label: string }[] = [
  { value: 0.5, label: '0.5x' },
  { value: 1, label: '1x' },
  { value: 2, label: '2x' },
  { value: 3, label: '3x' },
];

// JPG quality presets
export type JpgQualityPreset = 50 | 75 | 90 | 100;

export const JPG_QUALITY_PRESETS: { value: JpgQualityPreset; label: string }[] = [
  { value: 50, label: '50%' },
  { value: 75, label: '75%' },
  { value: 90, label: '90%' },
  { value: 100, label: '100%' },
];

// Unit types for dimension input
export type UnitType = 'pt' | 'px' | 'em' | 'rem' | 'cm' | 'mm' | 'in';

export const UNIT_TYPES: { value: UnitType; label: string }[] = [
  { value: 'pt', label: 'pt' },
  { value: 'px', label: 'px' },
  { value: 'em', label: 'em' },
  { value: 'rem', label: 'rem' },
  { value: 'cm', label: 'cm' },
  { value: 'mm', label: 'mm' },
  { value: 'in', label: 'in' },
];

// Conversion DPI presets for unit conversion
export type ConversionDPIPreset = 72 | 96 | 150 | 300 | 600;

export const CONVERSION_DPI_PRESETS: { value: ConversionDPIPreset; label: string }[] = [
  { value: 72, label: '72 DPI' },
  { value: 96, label: '96 DPI' },
  { value: 150, label: '150 DPI' },
  { value: 300, label: '300 DPI' },
  { value: 600, label: '600 DPI' },
];

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

