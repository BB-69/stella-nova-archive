export const DEFAULT_COLOR = "#00BBFF";

export function randomHexColor(): string {
  const hue = Math.floor(Math.random() * 360); // 0–359
  const saturation = 70 + Math.random() * 30; // 70–100%
  const lightness = 45 + Math.random() * 20; // 45–65%

  // HSL → RGB
  const c = (1 - Math.abs((2 * lightness) / 100 - 1)) * (saturation / 100);
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lightness / 100 - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const colorId: Record<string, string> = {
  title: "#FF8800",
};
export function getColorId(id: string) {
  return colorId[id.split("_")[0]] ?? DEFAULT_COLOR;
}
