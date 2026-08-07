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
      <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-5 text-center shadow-lg shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">WPM</p>
        <p className="mt-3 text-4xl font-semibold text-sky-400">{wpm}</p>
      </div>

      <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-5 text-center shadow-lg shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Accuracy</p>
        <p className="mt-3 text-4xl font-semibold text-emerald-400">{accuracy}%</p>
      </div>

      <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-5 text-center shadow-lg shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Time left</p>
        <p className="mt-3 text-4xl font-semibold text-rose-400">{timeLeft}s</p>
      </div>

      <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-5 text-center shadow-lg shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Words</p>
        <p className="mt-3 text-4xl font-semibold text-violet-400">{words}</p>
        <p className="mt-1 text-xs text-slate-500">{mistakes} mistake{mistakes === 1 ? "" : "s"}</p>
      </div>
    </div>
  );
}