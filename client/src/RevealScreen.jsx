import {useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {useCurio} from "./CurioContext.jsx";
import AskMeAnything from "./AskMeAnything.jsx";

function RevealCard({children, className, delay = 0}) {
  return (
    <section
      className={`animate-card-reveal rounded-[2rem] border-2 p-6 shadow-lg md:p-8 ${className}`}
      style={{animationDelay: `${delay}ms`}}
    >
      {children}
    </section>
  );
}

export default function RevealScreen() {
  const {bundle, setBundle, age, setAge} = useCurio();
  const navigate = useNavigate();
  const [punchlineVisible, setPunchlineVisible] = useState(false);

  if (!bundle) return <Navigate to="/" replace />;

  const {theme, emoji, fact, joke, experiment} = bundle;

  return (
    <>
      <main className="relative min-h-screen w-full bg-gradient-to-br from-rainbow-blue/60 via-curio-background to-rainbow-yellow/50 p-6 text-curio-text md:p-10">
        <div className="pointer-events-none absolute left-12 top-28 h-36 w-36 rounded-full bg-rainbow-orange/50 blur-2xl" />
        <div className="pointer-events-none absolute right-12 top-8 h-44 w-44 rounded-full bg-rainbow-pink/40 blur-2xl" />

        <section className="relative mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => {
              setBundle(null);
              setAge(null);
              navigate("/");
            }}
            className="absolute right-0 top-0 z-10 whitespace-nowrap rounded-full border-2 border-rainbow-purple bg-rainbow-purple/20 px-4 py-3 text-sm font-extrabold text-curio-text shadow-md transition-colors duration-200 hover:bg-rainbow-purple hover:text-white focus:outline-none focus:ring-4 focus:ring-rainbow-blue/50"
          >
            New Discovery ↻
          </button>

          <header className="animate-card-reveal flex flex-col items-center pt-16 text-center md:pr-40 md:pt-0">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-rainbow-pink">
              Your discovery box
            </p>
            <h1 className="mt-4 max-w-full break-words text-2xl font-black leading-tight tracking-[-0.04em] text-rainbow-purple sm:text-3xl md:text-4xl lg:text-5xl">
              Today&apos;s theme: {theme}{" "}
              <span className="inline-block" aria-hidden="true">
                {emoji}
              </span>
            </h1>
          </header>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="min-w-0 space-y-6">
              <RevealCard
                delay={100}
                className="border-rainbow-blue bg-rainbow-blue/20"
              >
                <p className="mb-5 text-lg font-black uppercase tracking-[0.18em] text-sky-800 md:text-xl">
                  Fun fact
                </p>
                <p className="text-xl font-semibold leading-8 md:text-2xl">
                  {fact}
                </p>
              </RevealCard>

              <RevealCard
                delay={200}
                className="border-rainbow-yellow bg-rainbow-yellow/25"
              >
                <p className="mb-5 text-lg font-black uppercase tracking-[0.18em] text-amber-800 md:text-xl">
                  Joke time
                </p>
                <button
                  type="button"
                  onClick={() => setPunchlineVisible(true)}
                  className="w-full rounded-3xl border-2 border-rainbow-yellow bg-curio-background/70 p-6 text-left font-bold text-curio-text transition-colors duration-200 hover:bg-rainbow-yellow hover:text-white focus:outline-none focus:ring-4 focus:ring-rainbow-blue/50"
                >
                  {punchlineVisible ? (
                    <span className="animate-punchline-reveal block text-xl leading-8 md:text-2xl">
                      {joke}
                    </span>
                  ) : (
                    <span className="block text-xl md:text-2xl">
                      Tap to reveal punchline! Ready for a joke about {theme}?
                    </span>
                  )}
                </button>
              </RevealCard>
            </div>

            <RevealCard
              delay={300}
              className="flex h-full min-h-80 min-w-0 flex-col border-rainbow-green bg-rainbow-green/20"
            >
              <p className="mb-5 text-lg font-black uppercase tracking-[0.18em] text-green-800 md:text-xl">
                Try it at home
              </p>
              <h2 className="text-4xl font-black">{experiment.title}</h2>
              <p className="mt-5 text-xl leading-8 md:text-2xl">
                A hands-on {theme.toLowerCase()} activity with everyday
                materials.
              </p>
              <button
                type="button"
                onClick={() => navigate("/activity")}
                className="mt-auto rounded-3xl bg-gradient-to-r from-rainbow-purple via-rainbow-pink to-rainbow-red px-6 py-4 text-xl font-black text-white shadow-lg shadow-rainbow-pink/30 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-rainbow-blue/50"
              >
                Let&apos;s do it!
              </button>
            </RevealCard>
          </div>
        </section>
      </main>

      <AskMeAnything theme={bundle.theme} age={age} />
    </>
  );
}
