import type { GlobalStyles } from "@juo/blocks";

// ─── Color conversion: hex → oklch ──────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const r = parseInt(h.length === 3 ? h[0] + h[0] : h.slice(0, 2), 16) / 255;
  const g = parseInt(h.length === 3 ? h[1] + h[1] : h.slice(2, 4), 16) / 255;
  const b = parseInt(h.length === 3 ? h[2] + h[2] : h.slice(4, 6), 16) / 255;
  return [r, g, b];
}

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function hexToOklch(hex: string): { L: number; C: number; h: number } {
  const [sr, sg, sb] = hexToRgb(hex);
  const r = srgbToLinear(sr);
  const g = srgbToLinear(sg);
  const b = srgbToLinear(sb);

  // Linear sRGB → XYZ (D65)
  const x = 0.4123907993 * r + 0.3575843394 * g + 0.1804807884 * b;
  const y = 0.2126390059 * r + 0.7151686788 * g + 0.0721923154 * b;
  const z = 0.0193308187 * r + 0.1191947798 * g + 0.9505321522 * b;

  // XYZ → LMS (cube root)
  const l_ = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
  const m_ = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
  const s_ = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z);

  // LMS → Oklab
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const ob = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  // Oklab → Oklch
  const C = Math.sqrt(a * a + ob * ob);
  let h = Math.atan2(ob, a) * (180 / Math.PI);
  if (h < 0) h += 360;

  return { L, C, h: Number.isNaN(h) ? 0 : h };
}

// ─── Palette generation ─────────────────────────────────────────────────

const PALETTE_STEPS: Array<{ step: number; L: number; chromaScale: number }> = [
  { step: 25, L: 0.985, chromaScale: 0.12 },
  { step: 50, L: 0.97, chromaScale: 0.2 },
  { step: 100, L: 0.95, chromaScale: 0.33 },
  { step: 200, L: 0.9, chromaScale: 0.5 },
  { step: 300, L: 0.82, chromaScale: 0.67 },
  { step: 400, L: 0.7, chromaScale: 0.83 },
  { step: 500, L: 0.62, chromaScale: 1.0 },
  { step: 600, L: 0.55, chromaScale: 1.08 },
  { step: 700, L: 0.45, chromaScale: 1.0 },
  { step: 800, L: 0.32, chromaScale: 0.83 },
  { step: 900, L: 0.18, chromaScale: 0.5 },
];

function oklchStr(L: number, C: number, h: number): string {
  return `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(4)} ${h.toFixed(1)})`;
}

function generatePalette(hex: string): Record<number, string> {
  const { C, h } = hexToOklch(hex);
  const peakChroma = Math.min(C, 0.17);

  const result: Record<number, string> = {};
  for (const { step, L, chromaScale } of PALETTE_STEPS) {
    result[step] = oklchStr(L, peakChroma * chromaScale, h);
  }
  return result;
}

// ─── Volume → CSS variables ─────────────────────────────────────────────

function volumeVars(volume: GlobalStyles["volume"]): Record<string, string> {
  switch (volume) {
    case "compact":
      return {
        "--theme-spacing": "6px",
        "--theme-padding": "6px",
        "--theme-font-size": "14px",
      };
    case "spacious":
      return {
        "--theme-spacing": "12px",
        "--theme-padding": "12px",
        "--theme-font-size": "16px",
      };
    default:
      return {
        "--theme-spacing": "8px",
        "--theme-padding": "8px",
        "--theme-font-size": "16px",
      };
  }
}

// ─── Corners → CSS variables ────────────────────────────────────────────

const RADIUS_MAP: Record<string, string> = {
  sharp: "0px",
  soft: "4px",
  round: "8px",
  pill: "100px",
};
const BUTTON_RADIUS_MAP: Record<string, string> = {
  sharp: "0px",
  round: "4px",
  circle: "100px",
};
const THUMBNAIL_RADIUS_MAP: Record<string, string> = {
  sharp: "0%",
  round: "12px",
  circle: "50%",
};

function cornerVars(styles: GlobalStyles): Record<string, string> {
  return {
    "--theme-radius": RADIUS_MAP[styles.corners] ?? "4px",
    "--theme-buttons-rounding": BUTTON_RADIUS_MAP[styles.buttonCorners] ?? "4px",
    "--theme-thumbnail-rounding": THUMBNAIL_RADIUS_MAP[styles.thumbnailCorners] ?? "50%",
  };
}

// ─── Style → surface CSS variables ──────────────────────────────────────

function styleVars(style: GlobalStyles["style"]): Record<string, string> {
  switch (style) {
    case "bare":
      return {
        "--theme-surface-1": "transparent",
        "--theme-surface-1-border": "transparent",
        "--theme-surface-2": "transparent",
        "--theme-surface-2-border": "transparent",
        "--theme-surface-3": "transparent",
        "--theme-surface-3-border": "transparent",
      };
    case "tinted":
      return {
        "--theme-surface-1": "var(--tint-25)",
        "--theme-surface-1-border": "transparent",
        "--theme-surface-2": "var(--tint-50)",
        "--theme-surface-2-border": "transparent",
        "--theme-surface-3": "var(--tint-100)",
        "--theme-surface-3-border": "transparent",
      };
    case "solid":
      return {
        "--theme-surface-1": "var(--white)",
        "--theme-surface-1-border": "var(--tint-200)",
        "--theme-surface-2": "var(--white)",
        "--theme-surface-2-border": "var(--tint-300)",
        "--theme-surface-3": "var(--tint-50)",
        "--theme-surface-3-border": "var(--tint-200)",
      };
    case "layered":
      return {
        "--theme-surface-1": "var(--tint-25)",
        "--theme-surface-1-border": "var(--tint-200)",
        "--theme-surface-2": "var(--white)",
        "--theme-surface-2-border": "var(--tint-300)",
        "--theme-surface-3": "var(--tint-50)",
        "--theme-surface-3-border": "var(--tint-200)",
      };
    default:
      return {
        "--theme-surface-1": "transparent",
        "--theme-surface-1-border": "transparent",
        "--theme-surface-2": "var(--white)",
        "--theme-surface-2-border": "var(--tint-300)",
        "--theme-surface-3": "transparent",
        "--theme-surface-3-border": "transparent",
      };
  }
}

// ─── Main ────────────────────────────────────────────────────────────────

const COLOR_TO_PREFIX: Array<[keyof GlobalStyles["colors"], string]> = [
  ["accent", "accent"],
  ["secondary", "secondary"],
  ["tint", "tint"],
  ["callout", "callout"],
  ["success", "success"],
  ["error", "error"],
  ["information", "info"],
  ["warning", "warning"],
];

export function applyGlobalStyles(el: HTMLElement, styles: GlobalStyles): void {
  // Color palettes
  for (const [colorKey, prefix] of COLOR_TO_PREFIX) {
    const hex = styles.colors[colorKey];
    if (!hex) continue;
    const palette = generatePalette(hex);
    for (const [step, value] of Object.entries(palette)) {
      el.style.setProperty(`--theme-${prefix}-${step}`, value);
    }
  }

  // Background → white token
  if (styles.colors.background) {
    const { L, C, h } = hexToOklch(styles.colors.background);
    el.style.setProperty("--theme-white", oklchStr(L, C, h));
  }

  // Volume
  for (const [k, v] of Object.entries(volumeVars(styles.volume))) {
    el.style.setProperty(k, v);
  }

  // Corners
  for (const [k, v] of Object.entries(cornerVars(styles))) {
    el.style.setProperty(k, v);
  }

  // Style (surfaces)
  for (const [k, v] of Object.entries(styleVars(styles.style))) {
    el.style.setProperty(k, v);
  }
}
