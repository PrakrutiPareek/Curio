import {useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {useCurio} from "./CurioContext.jsx";
import AskMeAnything from "./AskMeAnything.jsx";
import {
  getCompletedExperiments,
  incrementCompletedExperiments,
} from "./completionBadge.js";

const stepStyles = [
  "border-rainbow-red bg-rainbow-red/20 text-red-800",
  "border-rainbow-orange bg-rainbow-orange/20 text-orange-800",
  "border-rainbow-yellow bg-rainbow-yellow/25 text-amber-800",
  "border-rainbow-green bg-rainbow-green/20 text-green-800",
  "border-rainbow-blue bg-rainbow-blue/20 text-sky-800",
  "border-rainbow-purple bg-rainbow-purple/20 text-violet-800",
  "border-rainbow-pink bg-rainbow-pink/20 text-pink-800",
];

export default function ActivityScreen() {
  const {bundle, age} = useCurio();
  const navigate = useNavigate();
  const [whyVisible, setWhyVisible] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [completedCount, setCompletedCount] = useState(getCompletedExperiments);

  if (!bundle) return <Navigate to="/" replace />;

  const {experiment, theme} = bundle;

  function markDone() {
    if (isDone) return;
    setCompletedCount(incrementCompletedExperiments());
    setIsDone(true);
  }

  return (
    <>
      <main className="relative min-h-screen w-full bg-gradient-to-br from-rainbow-purple/35 via-curio-background to-rainbow-green/35 p-6 text-curio-text md:p-10">
        <div className="pointer-events-none absolute left-12 top-32 h-36 w-36 rounded-full bg-rainbow-blue/40 blur-2xl" />
        <div className="pointer-events-none absolute right-12 top-12 h-44 w-44 rounded-full bg-rainbow-pink/35 blur-2xl" />

        <section className="relative mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => navigate("/reveal")}
            className="absolute left-0 top-0 rounded-full border-2 border-rainbow-purple bg-rainbow-purple/20 px-4 py-3 text-sm font-extrabold text-curio-text shadow-md transition-colors duration-200 hover:bg-rainbow-purple hover:text-white focus:outline-none focus:ring-4 focus:ring-rainbow-blue/50"
          >
            ← Back
          </button>
          <p className="absolute right-0 top-0 rounded-full border-2 border-rainbow-pink bg-rainbow-pink/20 px-4 py-3 text-sm font-extrabold text-pink-800 shadow-md">
            Badges: {completedCount}
          </p>

          <header className="flex flex-col items-center pt-16 text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-rainbow-pink">
              Try it at home
            </p>
            <h1 className="mt-4 max-w-full break-words text-2xl font-black leading-tight tracking-[-0.04em] text-rainbow-purple sm:text-3xl md:text-4xl lg:text-5xl">
              {experiment.title}
            </h1>
          </header>

          <div className="mt-6 space-y-6">
            <section className="rounded-[2rem] border-2 border-rainbow-blue bg-rainbow-blue/20 p-6 shadow-lg md:p-8">
              <h2 className="mb-5 text-lg font-black uppercase tracking-[0.18em] text-sky-800 md:text-xl">
                What you&apos;ll need
              </h2>
              <ul className="space-y-4 text-xl font-semibold md:text-2xl">
                {experiment.materials.map((material) => (
                  <li key={material} className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 border-rainbow-blue bg-curio-background text-sm text-sky-800"
                    >
                      ✓
                    </span>
                    <span>{material}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-5 text-center text-lg font-black uppercase tracking-[0.18em] text-rainbow-purple md:text-xl">
                Let&apos;s make it
              </h2>
              <ol className="space-y-6">
                {experiment.steps.map((step, index) => (
                  <li
                    key={`${index}-${step}`}
                    className={`flex gap-5 rounded-[2rem] border-2 p-6 shadow-lg md:p-8 ${stepStyles[index % stepStyles.length]}`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-curio-background text-xl font-black shadow-sm">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-xl font-semibold leading-8 text-curio-text md:text-2xl">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <aside className="rounded-[2rem] border-2 border-rainbow-orange bg-rainbow-orange/25 p-6 shadow-lg md:p-8">
              <div className="flex gap-4">
                <span aria-hidden="true" className="text-4xl">
                  ⚠️
                </span>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-[0.18em] text-orange-800 md:text-xl">
                    Ask a grown-up to help!
                  </h2>
                  <p className="mt-4 text-xl font-semibold leading-8 md:text-2xl">
                    {experiment.safetyNote}
                  </p>
                </div>
              </div>
            </aside>

            <section className="rounded-[2rem] border-2 border-rainbow-purple bg-rainbow-purple/20 p-6 shadow-lg md:p-8">
              <button
                type="button"
                aria-expanded={whyVisible}
                onClick={() => setWhyVisible((visible) => !visible)}
                className="flex w-full items-center justify-between gap-4 text-left focus:outline-none focus:ring-4 focus:ring-rainbow-blue/50"
              >
                <span className="text-lg font-black uppercase tracking-[0.18em] text-violet-800 md:text-xl">
                  Curious why?
                </span>
                <span
                  aria-hidden="true"
                  className="text-3xl font-black text-violet-800"
                >
                  {whyVisible ? "−" : "+"}
                </span>
              </button>
              {whyVisible && (
                <p className="animate-punchline-reveal mt-5 text-xl font-semibold leading-8 md:text-2xl">
                  {experiment.whyItWorks}
                </p>
              )}
            </section>

            <div className="relative pb-6 text-center">
              {isDone && (
                <div
                  aria-hidden="true"
                  className="animate-celebration pointer-events-none absolute inset-x-0 -top-10 text-4xl"
                >
                  🎉 ✨ 🎊
                </div>
              )}
              <button
                type="button"
                onClick={markDone}
                disabled={isDone}
                className="rounded-3xl bg-gradient-to-r from-rainbow-purple via-rainbow-pink to-rainbow-red px-8 py-5 text-xl font-black text-white shadow-lg shadow-rainbow-pink/30 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-rainbow-blue/50 disabled:cursor-default disabled:opacity-80"
              >
                {isDone ? "Experiment complete! 🎉" : "Mark as done!"}
              </button>
            </div>
          </div>
        </section>
      </main>

      <AskMeAnything theme={theme} age={age} />
    </>
  );
}
