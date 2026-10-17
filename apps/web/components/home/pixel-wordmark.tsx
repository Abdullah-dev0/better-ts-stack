// "BETTER-TS / STACK" drawn from a 5x7 bitmap font, as SVG so it stays sharp
// at any width
const GLYPHS: Record<string, string[]> = {
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  "-": ["0000", "0000", "0000", "1111", "0000", "0000", "0000"],
};

const LINES = ["BETTER-TS", "STACK"];
const GLYPH_HEIGHT = 7;
const LETTER_GAP = 1;
const LINE_GAP = 2;
const PIXEL = 0.9;
const SHADOW_OFFSET = 0.42;

interface Pixel {
  x: number;
  y: number;
}

function layoutPixels(): { pixels: Pixel[]; width: number; height: number } {
  const pixels: Pixel[] = [];
  let width = 0;
  LINES.forEach((line, lineIndex) => {
    const top = lineIndex * (GLYPH_HEIGHT + LINE_GAP);
    let left = 0;
    for (const char of line) {
      const rows = GLYPHS[char];
      rows.forEach((row, y) => {
        [...row].forEach((bit, x) => {
          if (bit === "1") pixels.push({ x: left + x, y: top + y });
        });
      });
      left += rows[0].length + LETTER_GAP;
    }
    width = Math.max(width, left - LETTER_GAP);
  });
  const height = LINES.length * GLYPH_HEIGHT + (LINES.length - 1) * LINE_GAP;
  return { pixels, width, height };
}

const { pixels, width, height } = layoutPixels();

export function PixelWordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${width + SHADOW_OFFSET} ${height + SHADOW_OFFSET}`}
      className={className}
      aria-hidden
      shapeRendering="crispEdges"
    >
      <defs>
        {/* In user space, so the gradient runs across the whole word rather
            than repeating inside each pixel */}
        <linearGradient
          id="wordmark-fill"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2={width}
          y2={height}
        >
          <stop offset="0%" style={{ stopColor: "var(--tui-amber)" }} />
          <stop offset="60%" style={{ stopColor: "var(--tui-pink)" }} />
          <stop offset="100%" style={{ stopColor: "var(--tui-lavender)" }} />
        </linearGradient>
      </defs>
      <g className="fill-tui-amber/25">
        {pixels.map(({ x, y }) => (
          <rect
            key={`s${x}-${y}`}
            x={x + SHADOW_OFFSET}
            y={y + SHADOW_OFFSET}
            width={PIXEL}
            height={PIXEL}
          />
        ))}
      </g>
      <g fill="url(#wordmark-fill)">
        {pixels.map(({ x, y }) => (
          <rect key={`p${x}-${y}`} x={x} y={y} width={PIXEL} height={PIXEL} />
        ))}
      </g>
    </svg>
  );
}
