# LaTeX Math Equation Editor

A self-hosted Next.js TypeScript web application for easily editing LaTeX math equations with live preview and client-side image export capabilities. Export equations to SVG format for further editing in vector design tools like Affinity Designer or Inkscape.

## Project Overview

**Purpose**: Self-hosted project for easily editing LaTeX math equations and exporting them to SVG format

**Primary Use Case**: Export equations as SVG for further editing in vector design tools (Affinity Designer, Inkscape)

**Technology Stack**: 
- Next.js 16.1.1 (React 19.2.3)
- TypeScript 5.9.3
- MathJax 4.0.0
- Tailwind CSS 4.1.18

**Deployment**: Self-hosted solution with Docker support for easy deployment

## Features

- **Multiple Math Modes**: 
  - `equation`: Uses `\begin{equation}...\end{equation}` wrapper
  - `inline`: Uses `\(...\)` delimiters
  - `display`: Uses `\[...\]` delimiters

- **Interactive Symbol Palette**: Common mathematical symbols and Greek alphabet (both lowercase and uppercase) for click-to-insert functionality

- **Font Selection**: MathJax output font (TeX - default)

- **Live Preview**: Real-time MathJax rendering as you type

- **Export Options**: 
  - SVG: Download as file or copy code (element/document format)
    - Scale presets: 0.5x, 1x, 2x, 3x
  - PNG: Raster image export with DPI control (150, 300, 600, 1200 DPI)
    - Optional transparent background (alpha channel)
  - JPG: Raster image export with DPI control (150, 300, 600, 1200 DPI)
    - Quality presets: 50%, 75%, 90%, 100%

- **Flexible Dimensions**: 
  - Auto-size (default)
  - Preset sizes: Small (400px), Medium (800px), Large (1200px)
  - Custom dimensions: Specify exact width and/or height in pixels
  - PNG/JPG dimensions auto-populate at 3x SVG size for high-quality export

- **Equation Examples**: Pre-built library of common mathematical equations organized by 17 categories for quick insertion:
  - Algebra, Calculus, Linear Algebra, Geometry
  - Complex Analysis, Analysis, Number Theory
  - Physics, Quantum Physics, Electromagnetism, Relativity, Fluid Dynamics
  - PDEs (Partial Differential Equations)
  - Probability, Statistics, Finance
  - Inequalities

- **Copy Functionality**: Copy full equation (with wrapper) or SVG code to clipboard
  - Visual confirmation modal shows copied content

## Setup Instructions

### Prerequisites

- Node.js 20+ (tested with Node.js 20.19+) 
- npm or yarn
- Docker (optional, for containerized deployment)

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t tex-math-editor .
```

2. Run the container:
```bash
docker run -p 3000:3000 tex-math-editor
```

Or use docker-compose:
```bash
docker-compose up -d
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Usage Guide

### Editing Equations

1. **Select Math Mode**: Choose between equation, inline, or display mode using the buttons in the editor panel
2. **Type Equation**: Enter your LaTeX equation content in the textarea (e.g., `x = y + z`)
   - The editor automatically wraps your input with the appropriate delimiters based on the selected mode
3. **Use Symbol Palette**: Click on symbols from the palette to insert them at your cursor position
   - Toggle symbol palette visibility with the "Show/Hide Symbol Palette" button
4. **Use Equation Examples**: Click the floating examples button (top-right) to browse and insert pre-built equations
   - Browse by 17 categories: Algebra, Calculus, Linear Algebra, Geometry, Complex Analysis, Analysis, Number Theory, Physics, Quantum Physics, Electromagnetism, Relativity, Fluid Dynamics, PDEs, Probability, Statistics, Finance, and Inequalities
   - Click any example to insert it into the editor
5. **Live Preview**: See your equation rendered in real-time in the preview panel

### Font Selection

1. Use the font dropdown at the top of the editor panel
2. Select from available MathJax fonts
3. The preview updates immediately with the selected font

### Exporting Equations

1. **Choose Format**: Select SVG, PNG, or JPG from the format buttons
2. **Set Dimensions** (optional):
   - Use preset buttons: Small, Medium, or Large
   - Or enter custom width/height in pixels
   - Leave empty for auto-size
   - PNG/JPG: Dimensions auto-populate at 3x SVG size for high-quality output
3. **Configure Export Settings**:
   - **SVG**: Set scale (0.5x, 1x, 2x, 3x) and custom filename
   - **PNG**: Set DPI (150, 300, 600, 1200), enable/disable transparent background, and custom filename
   - **JPG**: Set DPI (150, 300, 600, 1200), quality (50%, 75%, 90%, 100%), and custom filename
4. **Export**:
   - For SVG: Click "Download SVG" to download, or use "Copy SVG Element"/"Copy SVG Document" to copy code
   - For PNG/JPG: Click the export button to download

### Copying Equations

- **Copy Full Equation**: Use the "Copy Equation" button in the editor to copy the complete equation with wrapper to clipboard
- **Copy SVG Code**: Use the SVG copy buttons in the export panel to copy SVG code for use in HTML/CSS

## Development

### Project Structure

```
tex-math-editor/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Main editor page
│   └── globals.css
├── components/
│   ├── EquationEditor.tsx
│   ├── EquationPreview.tsx
│   ├── SymbolPalette.tsx     # Mathematical symbol palette
│   ├── FontSelector.tsx      # Font selection dropdown
│   ├── ExportControls.tsx    # Export UI with dimension controls
│   ├── ExampleSelector.tsx   # Equation examples browser
│   └── CopyNotificationModal.tsx  # Copy confirmation modal
├── lib/
│   ├── mathjax-config.ts     # MathJax configuration
│   ├── exportUtils.ts        # Client export helpers
│   ├── equationUtils.ts      # Equation wrapper and formatting utilities
│   ├── equationExamples.ts   # Pre-built equation examples library
│   ├── constants.ts          # Export dimension presets and constants
│   └── unitConverter.ts     # Unit conversion utilities
├── Dockerfile                # Multi-stage Docker build
├── .dockerignore             # Docker build exclusions
├── docker-compose.yml        # Docker Compose configuration
├── README.md                 # Project documentation
├── package.json
├── tsconfig.json
└── next.config.ts
```

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Docker Commands

```bash
# Build image
docker build -t tex-math-editor .

# Run container
docker run -p 3000:3000 tex-math-editor

# Using docker-compose
docker-compose up -d        # Start in background
docker-compose down         # Stop
docker-compose logs -f      # View logs
docker-compose ps           # Check status
```

**Note**: The Docker setup includes a healthcheck that monitors the application status.
The container runs as a non-root user for improved security.

## License

Private project - all rights reserved.
