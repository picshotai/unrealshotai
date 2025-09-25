// lib/patterns.ts

export type Pattern = {
    id: string
    name: string
    svg: string
    color: string // Made color required instead of optional
  }
  
  export const patterns: Pattern[] = [
    {
      id: "circles",
      name: "Circles",
      svg: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="1.5" fill="currentColor" fillOpacity="0.3"/>
          <circle cx="13" cy="13" r="1.5" fill="currentColor" fillOpacity="0.3"/>
        </svg>
      `)}`,
      color: "#000000"
    },
    {
      id: "dots",
      name: "Dots",
      svg: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <circle cx="2" cy="2" r="1" fill="currentColor" fillOpacity="0.3"/>
          <circle cx="10" cy="10" r="1" fill="currentColor" fillOpacity="0.3"/>
          <circle cx="18" cy="18" r="1" fill="currentColor" fillOpacity="0.3"/>
        </svg>
      `)}`,
      color: "#000000"
    },
    {
      id: "grid",
      name: "Grid",
      svg: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1h18v18H1V1z" fill="none" stroke="currentColor" strokeOpacity="0.2"/>
        </svg>
      `)}`,
      color: "#000000"
    },
    {
      id: "crosses",
      name: "Crosses",
      svg: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 2h4v4h4v4h-4v4h-4v-4H4V6h4V2z" fill="currentColor" fillOpacity="0.3"/>
        </svg>
      `)}`,
      color: "#000000"
    },
    {
      id: "diagonal-lines",
      name: "Diagonal Lines",
      svg: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 20L20 0" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2"/>
        </svg>
      `)}`,
      color: "#000000"
    },
    {
      id: "zigzag",
      name: "Zigzag",
      svg: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 5l5 5-5 5 5-5 5 5 5-5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" fill="none"/>
        </svg>
      `)}`,
      color: "#000000"
    },
    {
      id: "triangles",
      name: "Triangles",
      svg: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2l8 16H2z" fill="currentColor" fillOpacity="0.1"/>
        </svg>
      `)}`,
      color: "#000000"
    },
    {
      id: "squares",
      name: "Squares",
      svg: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="6" height="6" fill="currentColor" fillOpacity="0.2"/>
          <rect x="12" y="12" width="6" height="6" fill="currentColor" fillOpacity="0.2"/>
        </svg>
      `)}`,
      color: "#000000"
    },
    {
      id: "waves",
      name: "Waves",
      svg: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 10c2.5-5 7.5-5 10 0s7.5 5 10 0" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" fill="none"/>
        </svg>
      `)}`,
      color: "#000000"
    },
    {
      id: "hexagons",
      name: "Hexagons",
      svg: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 1l8 4v10l-8 4-8-4V5z" fill="none" stroke="currentColor" strokeOpacity="0.2"/>
        </svg>
      `)}`,
      color: "#000000"
    },
    {
      id: "minimal-triangles",
      name: "Minimal Triangles",
      svg: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 40L20 20L40 40" stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.2"/>
      </svg>
    `)}`,
      color: "#000000"
    },
    {
      id: "modern-squares",
      name: "Modern Squares",
      svg: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="10" height="10" fill="currentColor" fillOpacity="0.1"/>
        <rect x="25" y="25" width="10" height="10" fill="currentColor" fillOpacity="0.1"/>
      </svg>
    `)}`,
      color: "#000000"
    },
    {
      id: "subtle-waves",
      name: "Subtle Waves",
      svg: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 20C5 15, 10 25, 20 20S35 15, 40 20" stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.2"/>
      </svg>
    `)}`,
      color: "#000000"
    },
    {
      id: "minimalist-plus",
      name: "Minimalist Plus",
      svg: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 10V30M10 20H30" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2"/>
      </svg>
    `)}`,
      color: "#000000"
    },
    {
      id: "dotted-grid",
      name: "Dotted Grid",
      svg: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="1" fill="currentColor" fillOpacity="0.2"/>
        <circle cx="30" cy="10" r="1" fill="currentColor" fillOpacity="0.2"/>
        <circle cx="10" cy="30" r="1" fill="currentColor" fillOpacity="0.2"/>
        <circle cx="30" cy="30" r="1" fill="currentColor" fillOpacity="0.2"/>
      </svg>
    `)}`,
      color: "#000000"
    },
    {
      id: "geometric-lines",
      name: "Geometric Lines",
      svg: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 20L20 0M20 40L40 20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2"/>
      </svg>
    `)}`,
      color: "#000000"
    },
    {
        id: "offset-circles",
        name: "Offset Circles",
        svg: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="15" r="4" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2"/>
            <circle cx="25" cy="25" r="4" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2"/>
          </svg>
        `)}`,
        color: "#000000"
      },
      {
        id: "diagonal-stripes",
        name: "Diagonal Stripes",
        svg: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40L10 30M10 40L20 30M20 40L30 30M30 40L40 30" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2"/>
          </svg>
        `)}`,
        color: "#000000"
      },
      {
        id: "minimal-diamonds",
        name: "Minimal Diamonds",
        svg: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 10L30 20L20 30L10 20Z" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2"/>
          </svg>
        `)}`,
        color: "#000000"
      },
      {
        id: "curved-lines",
        name: "Curved Lines",
        svg: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 30C15 20, 25 20, 30 30" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" fill="none"/>
            <path d="M10 10C15 20, 25 20, 30 10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" fill="none"/>
          </svg>
        `)}`,
        color: "#000000"
      },
      {
        id: "floating-dots",
        name: "Floating Dots",
        svg: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="12" r="1.5" fill="currentColor" fillOpacity="0.2"/>
            <circle cx="32" cy="16" r="1.5" fill="currentColor" fillOpacity="0.2"/>
            <circle cx="20" cy="28" r="1.5" fill="currentColor" fillOpacity="0.2"/>
          </svg>
        `)}`,
        color: "#000000"
      },
      {
        id: "angled-lines",
        name: "Angled Lines",
        svg: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 30L30 10M15 35L35 15" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2"/>
          </svg>
        `)}`,
        color: "#000000"
      },
      {
        id: "hex-grid",
        name: "Hex Grid",
        svg: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 10L20 5L27 10L27 20L20 25L13 20Z" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15"/>
          </svg>
        `)}`,
        color: "#000000"
      },
      {
        id: "modern-circles",
        name: "Modern Circles",
        svg: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2"/>
            <circle cx="20" cy="20" r="4" fill="currentColor" fillOpacity="0.1"/>
          </svg>
        `)}`,
        color: "#000000"
      },
      {
        id: "elegant-grid",
        name: "Elegant Grid",
        svg: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.1"/>
            <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.1"/>
          </svg>
        `)}`,
        color: "#000000"
      },
      {
        id: "professional-stripes",
        name: "Professional Stripes",
        svg: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="10" x2="40" y2="30" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1"/>
            <line x1="0" y1="30" x2="40" y2="10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1"/>
          </svg>
        `)}`,
        color: "#000000"
      },
      {
        id: "tech-squares",
        name: "Tech Squares",
        svg: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15"/>
            <rect x="22" y="22" width="10" height="10" fill="currentColor" fillOpacity="0.1"/>
          </svg>
        `)}`,
        color: "#000000"
      },
      {
        id: "corporate-dots",
        name: "Corporate Dots",
        svg: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="1.5" fill="currentColor" fillOpacity="0.2"/>
            <circle cx="5" cy="5" r="1" fill="currentColor" fillOpacity="0.15"/>
            <circle cx="35" cy="35" r="1" fill="currentColor" fillOpacity="0.15"/>
          </svg>
        `)}`,
        color: "#000000"
      },
      {
        id: "subtle-chevron",
        name: "Subtle Chevron",
        svg: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20L20 30L40 20" stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.1"/>
            <path d="M0 25L20 35L40 25" stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.1"/>
          </svg>
        `)}`,
        color: "#000000"
      },
      {
        id: "gradient-diamonds",
        name: "Gradient Diamonds",
        svg: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 10L30 20L20 30L10 20Z" fill="currentColor" fillOpacity="0.05"/>
            <path d="M20 5L35 20L20 35L5 20Z" stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.1"/>
          </svg>
        `)}`,
        color: "#000000"
      },
      {
        id: "modern-lattice",
        name: "Modern Lattice",
        svg: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20h40M20 0v40" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.1"/>
            <path d="M10 10h20v20H10z" stroke="currentColor" fill="none" strokeWidth="0.5" strokeOpacity="0.1"/>
          </svg>
        `)}`,
        color: "#000000"
      },
      {
        id: "business-weave",
        name: "Business Weave",
        svg: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20c10-10 30-10 40 0" stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.1"/>
            <path d="M0 25c10-10 30-10 40 0" stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.1"/>
          </svg>
        `)}`,
        color: "#000000"
      },
      {
        id: "tech-circuit",
        name: "Tech Circuit",
        svg: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0v15m0 10v15M0 20h15m10 0h15" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1"/>
            <circle cx="20" cy="20" r="2" fill="currentColor" fillOpacity="0.15"/>
          </svg>
        `)}`,
        color: "#000000"
      },
  ]
  