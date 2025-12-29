export interface EquationExample {
  name: string;
  category: string;
  latex: string;
  description?: string;
}

export const EQUATION_EXAMPLES: EquationExample[] = [
  // Algebra
  {
    name: 'Quadratic Formula',
    category: 'Algebra',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    description: 'Solution to quadratic equations',
  },
  {
    name: 'Binomial Theorem',
    category: 'Algebra',
    latex: '(x + y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k',
    description: 'Expansion of binomial expressions',
  },
  {
    name: 'Euler\'s Identity',
    category: 'Complex Analysis',
    latex: 'e^{i\\pi} + 1 = 0',
    description: 'The most beautiful equation in mathematics',
  },
  
  // Calculus
  {
    name: 'Fundamental Theorem of Calculus',
    category: 'Calculus',
    latex: '\\int_a^b f\'(x) \\, dx = f(b) - f(a)',
    description: 'Connection between derivatives and integrals',
  },
  {
    name: 'Product Rule',
    category: 'Calculus',
    latex: '\\frac{d}{dx}[f(x)g(x)] = f\'(x)g(x) + f(x)g\'(x)',
    description: 'Derivative of product of functions',
  },
  {
    name: 'Chain Rule',
    category: 'Calculus',
    latex: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)',
    description: 'Derivative of composite functions',
  },
  {
    name: 'Integration by Parts',
    category: 'Calculus',
    latex: '\\int u \\, dv = uv - \\int v \\, du',
    description: 'Integration technique',
  },
  {
    name: 'Gaussian Integral',
    category: 'Calculus',
    latex: '\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}',
    description: 'Classic definite integral result',
  },
  
  // Linear Algebra
  {
    name: 'Matrix Determinant (2x2)',
    category: 'Linear Algebra',
    latex: '\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc',
    description: 'Determinant of 2x2 matrix',
  },
  {
    name: 'Matrix Multiplication',
    category: 'Linear Algebra',
    latex: '(AB)_{ij} = \\sum_{k=1}^{n} A_{ik} B_{kj}',
    description: 'Element-wise formula for matrix multiplication',
  },
  {
    name: 'Eigenvalue Equation',
    category: 'Linear Algebra',
    latex: 'A\\mathbf{v} = \\lambda\\mathbf{v}',
    description: 'Characteristic equation for eigenvalues',
  },
  
  // Physics
  {
    name: 'Schrödinger Equation (Time-Dependent)',
    category: 'Quantum Physics',
    latex: 'i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r}, t) = \\hat{H}\\Psi(\\mathbf{r}, t)',
    description: 'Fundamental equation of quantum mechanics',
  },
  {
    name: 'Einstein\'s Mass-Energy Equivalence',
    category: 'Relativity',
    latex: 'E = mc^2',
    description: 'Famous equation from special relativity',
  },
  {
    name: 'Maxwell\'s Equations (Gauss\'s Law)',
    category: 'Electromagnetism',
    latex: '\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}',
    description: 'Gauss\'s law for electric fields',
  },
  {
    name: 'Wave Equation',
    category: 'Physics',
    latex: '\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u',
    description: 'Classical wave equation',
  },
  
  // Statistics & Probability
  {
    name: 'Bayes\' Theorem',
    category: 'Probability',
    latex: 'P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}',
    description: 'Conditional probability formula',
  },
  {
    name: 'Normal Distribution PDF',
    category: 'Statistics',
    latex: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}',
    description: 'Probability density function of normal distribution',
  },
  
  // Number Theory
  {
    name: 'Riemann Zeta Function',
    category: 'Number Theory',
    latex: '\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\prod_{p \\text{ prime}} \\frac{1}{1-p^{-s}}',
    description: 'Analytic continuation of zeta function',
  },
  {
    name: 'Euler\'s Totient Function',
    category: 'Number Theory',
    latex: '\\phi(n) = n \\prod_{p|n} \\left(1 - \\frac{1}{p}\\right)',
    description: 'Formula for Euler\'s totient function',
  },
  
  // Differential Equations
  {
    name: 'Heat Equation',
    category: 'PDEs',
    latex: '\\frac{\\partial u}{\\partial t} = \\alpha \\nabla^2 u',
    description: 'Partial differential equation for heat diffusion',
  },
  {
    name: 'Laplace\'s Equation',
    category: 'PDEs',
    latex: '\\nabla^2 \\phi = 0',
    description: 'Harmonic functions',
  },
  
  // Advanced Mathematics
  {
    name: 'Fourier Transform',
    category: 'Analysis',
    latex: 'F(\\omega) = \\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} \\, dt',
    description: 'Continuous Fourier transform',
  },
  {
    name: 'Cauchy-Schwarz Inequality',
    category: 'Inequalities',
    latex: '\\left|\\sum_{i=1}^{n} a_i b_i\\right|^2 \\leq \\left(\\sum_{i=1}^{n} |a_i|^2\\right)\\left(\\sum_{i=1}^{n} |b_i|^2\\right)',
    description: 'Fundamental inequality in analysis',
  },
  {
    name: 'Taylor Series',
    category: 'Analysis',
    latex: 'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n',
    description: 'Function representation as infinite series',
  },
  
  // Geometry
  {
    name: 'Pythagorean Theorem',
    category: 'Geometry',
    latex: 'a^2 + b^2 = c^2',
    description: 'Relationship in right triangles',
  },
  {
    name: 'Area of Circle',
    category: 'Geometry',
    latex: 'A = \\pi r^2',
    description: 'Area formula for circle',
  },
  {
    name: 'Volume of Sphere',
    category: 'Geometry',
    latex: 'V = \\frac{4}{3}\\pi r^3',
    description: 'Volume formula for sphere',
  },
  
  // Complex Examples
  {
    name: 'Navier-Stokes Equation',
    category: 'Fluid Dynamics',
    latex: '\\rho\\left(\\frac{\\partial \\mathbf{v}}{\\partial t} + \\mathbf{v} \\cdot \\nabla \\mathbf{v}\\right) = -\\nabla p + \\mu \\nabla^2 \\mathbf{v} + \\mathbf{f}',
    description: 'Equations describing fluid motion',
  },
  {
    name: 'Black-Scholes Equation',
    category: 'Finance',
    latex: '\\frac{\\partial V}{\\partial t} + \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS\\frac{\\partial V}{\\partial S} - rV = 0',
    description: 'Option pricing model',
  },
  {
    name: 'General Relativity Field Equation',
    category: 'Relativity',
    latex: 'R_{\\mu\\nu} - \\frac{1}{2}g_{\\mu\\nu}R + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}',
    description: 'Einstein\'s field equations',
  },
];

// Helper function to get examples by category
export function getExamplesByCategory(): Record<string, EquationExample[]> {
  const grouped: Record<string, EquationExample[]> = {};
  EQUATION_EXAMPLES.forEach((example) => {
    if (!grouped[example.category]) {
      grouped[example.category] = [];
    }
    grouped[example.category].push(example);
  });
  return grouped;
}

// Helper function to get all categories
export function getCategories(): string[] {
  return Array.from(new Set(EQUATION_EXAMPLES.map((ex) => ex.category))).sort();
}

