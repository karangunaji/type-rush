export function calculateWPM(charsTyped: number, secondsElapsed: number): number {
  if (secondsElapsed === 0) return 0;

  const words = charsTyped / 5;
  const minutes = secondsElapsed / 60;

  return Math.round(words / minutes);
}

export function calculateAccuracy(original: string, typed: string): number {
  if (typed.length === 0) return 100;

  let correct = 0;

  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === original[i]) correct++;
  }

  return Math.round((correct / typed.length) * 100);
}