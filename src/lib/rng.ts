/** Deterministic seeded RNG so every island always builds the same activities. */
export function makeRng(seed: number) {
  let s = (seed * 2654435761) % 4294967296 || 1;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

export function pick<T>(rand: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length) % arr.length]!;
}

export function intBetween(rand: () => number, min: number, max: number) {
  return min + Math.floor(rand() * (max - min + 1));
}

export function shuffle<T>(rand: () => number, arr: readonly T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function fa(value: number | string): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]!);
}
