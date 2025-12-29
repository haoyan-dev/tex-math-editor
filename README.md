# LaTeX Math Equation Editor

A self-hosted Next.js TypeScript web application for easily editing LaTeX math equations with live preview and server-side image export capabilities. Export equations to SVG format for further editing in vector design tools like Affinity Designer or Inkscape.

## Project Overview

**Purpose**: Self-hosted project for easily editing LaTeX math equations and exporting them to SVG format

**Primary Use Case**: Export equations as SVG for further editing in vector design tools (Affinity Designer, Inkscape)

**Technology Stack**: Next.js, TypeScript, MathJax

**Deployment**: Self-hosted solution with Docker support for easy deployment

## Features

- **Multiple Math Modes**: 
  - `equation`: Uses `\begin{equation}...\end{equation}` wrapper
  - `inline`: Uses `\(...\)` delimiters
  - `display`: Uses `\[...\]` delimiters

- **Interactive Symbol Palette**: Common mathematical symbols and Greek alphabet (both lowercase and uppercase) for click-to-insert functionality

- **Font Selection**: Multiple MathJax output fonts (TeX, STIX, Asana-Math, Latin-Modern, Computer-Modern, Neo-Euler, Gyre-Pagella, Gyre-Termes)

- **Live Preview**: Real-time MathJax rendering as you type

- **Export Options**: 
  - SVG: Download as file or copy code (element/document format)
  - PNG: Raster image export
  - JPG: Raster image export

- **Flexible Dimensions**: 
  - Auto-size (default)
  - Preset sizes: Small (400px), Medium (800px), Large (1200px)
  - Custom dimensions: Specify exact width and/or height in pixels

- **Copy Functionality**: Copy full equation (with wrapper) or SVG code to clipboard

## Setup Instructions

### Prerequisites

- Node.js 18+ 
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
4. **Live Preview**: See your equation rendered in real-time in the preview panel

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
3. **Export**:
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
│   ├── api/
│   │   └── export/
│   │       └── route.ts      # Export API endpoint
│   └── globals.css
├── components/
│   ├── EquationEditor.tsx
│   ├── EquationPreview.tsx
│   ├── SymbolPalette.tsx     # Mathematical symbol palette
│   ├── FontSelector.tsx      # Font selection dropdown
│   └── ExportControls.tsx    # Export UI with dimension controls
├── lib/
│   ├── mathjax-config.ts     # MathJax configuration
│   ├── exportUtils.ts        # Client export helpers
│   ├── equationUtils.ts      # Equation wrapper and formatting utilities
│   └── constants.ts          # Export dimension presets and constants
├── Dockerfile                # Multi-stage Docker build
├── .dockerignore             # Docker build exclusions
├── docker-compose.yml        # Docker Compose configuration
├── README.md                 # Project documentation
├── package.json
├── tsconfig.json
└── next.config.js
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
```

## API Documentation

### Export Endpoint

**POST** `/api/export`

Export a LaTeX equation as an image file or return SVG code.

#### Request Body

```json
{
  "equation": "string",          // LaTeX equation (required)
  "format": "svg" | "png" | "jpg",  // Export format (default: "svg")
  "font": "string",              // MathJax font name (optional, default: "TeX")
  "width": number,               // Image width in pixels (optional)
  "height": number,              // Image height in pixels (optional)
  "returnCode": boolean,         // For SVG: return code instead of file (optional)
  "svgFormat": "element" | "document"  // For SVG code: element or document format (optional)
}
```

#### Response Formats

- **SVG File**: Returns SVG file with `image/svg+xml` content type
- **SVG Code**: Returns plain text with SVG code (when `returnCode: true`)
- **PNG/JPG**: Returns image file with appropriate content type

#### Error Handling

Returns JSON error response with status code 400 or 500:
```json
{
  "error": "Error message"
}
```

## License

Private project - all rights reserved.
