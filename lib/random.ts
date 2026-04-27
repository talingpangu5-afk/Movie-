// Simple pseudo-random generator to satisfy strict purity checks
export function createRandom(seed: number = 12345) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export const staticRandom = createRandom();
