type Props = {
  wpm: number;
  accuracy: number;
  timeLeft: number;
  words: number;
  mistakes: number;
};

export default function Stats({ wpm, accuracy, timeLeft, words, mistakes }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
      <div className="rounded-3xl border border-surface-strong bg-surface p-5 text-center shadow-lg shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">WPM</p>
        <p className="mt-3 text-4xl font-semibold text-accent">{wpm}</p>
      </div>

      <div className="rounded-3xl border border-surface-strong bg-surface p-5 text-center shadow-lg shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Accuracy</p>
        <p className="mt-3 text-4xl font-semibold text-success">{accuracy}%</p>
      </div>

      <div className="rounded-3xl border border-surface-strong bg-surface p-5 text-center shadow-lg shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Time left</p>
        <p className="mt-3 text-4xl font-semibold text-danger">{timeLeft}s</p>
      </div>

      <div className="rounded-3xl border border-surface-strong bg-surface p-5 text-center shadow-lg shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Words</p>
        <p className="mt-3 text-4xl font-semibold text-warning">{words}</p>
        <p className="mt-1 text-xs text-muted">{mistakes} mistake{mistakes === 1 ? "" : "s"}</p>
      </div>
    </div>
  );
}