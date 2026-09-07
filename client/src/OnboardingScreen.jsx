import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCurio} from "./CurioContext.jsx";

const FRIENDLY_DISCOVERY_ERROR =
  "Oops! Our robot brain is taking a nap. Try again?";
const DISCOVERY_TIMEOUT_MS = 15000;

const ageRanges = [
  {label: "4–5", age: 5, detail: "Little explorer"},
  {label: "6–9", age: 8, detail: "Curious creator"},
  {label: "10–12", age: 11, detail: "Big thinker"},
];

const interests = [
  {label: "Space", icon: "🚀", value: "space"},
  {label: "Animals", icon: "🦊", value: "animals"},
  {label: "Nature", icon: "🌿", value: "nature"},
  {label: "Ocean", icon: "🐋", value: "ocean"},
  {label: "Dinosaurs", icon: "🦕", value: "dinosaurs"},
  {label: "Weather", icon: "🌦️", value: "weather"},
  {label: "Human Body", icon: "🫀", value: "human body"},
  {label: "Bugs & Insects", icon: "🐞", value: "bugs and insects"},
  {label: "Robots & Machines", icon: "🤖", value: "robots and machines"},
  {label: "Surprise me", icon: "🎁", value: ""},
];

const timeOptions = [5, 15, 30];

const rainbowButtonStyles = [
  {
    resting: "border-rainbow-red bg-rainbow-red/20",
    hover: "hover:bg-rainbow-red hover:text-white",
    active: "border-rainbow-red bg-rainbow-red",
  },
  {
    resting: "border-rainbow-orange bg-rainbow-orange/20",
    hover: "hover:bg-rainbow-orange hover:text-white",
    active: "border-rainbow-orange bg-rainbow-orange",
  },
  {
    resting: "border-rainbow-yellow bg-rainbow-yellow/25",
    hover: "hover:bg-rainbow-yellow hover:text-white",
    active: "border-rainbow-yellow bg-rainbow-yellow",
  },
  {
    resting: "border-rainbow-green bg-rainbow-green/20",
    hover: "hover:bg-rainbow-green hover:text-white",
    active: "border-rainbow-green bg-rainbow-green",
  },
  {
    resting: "border-rainbow-blue bg-rainbow-blue/20",
    hover: "hover:bg-rainbow-blue hover:text-white",
    active: "border-rainbow-blue bg-rainbow-blue",
  },
  {
    resting: "border-rainbow-purple bg-rainbow-purple/20",
    hover: "hover:bg-rainbow-purple hover:text-white",
    active: "border-rainbow-purple bg-rainbow-purple",
  },
  {
    resting: "border-rainbow-pink bg-rainbow-pink/20",
    hover: "hover:bg-rainbow-pink hover:text-white",
    active: "border-rainbow-pink bg-rainbow-pink",
  },
];

function ChoiceButton({active, color, children, className = "", ...props}) {
  return (
    <button
      type="button"
      className={`rounded-3xl border-2 p-5 text-left font-bold text-curio-text shadow-md transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-rainbow-blue/50 ${
        active
          ? `scale-105 border-4 text-white shadow-lg ${color.active}`
          : `${color.resting} ${color.hover} hover:shadow-lg`
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function OnboardingScreen() {
  const {
    setBundle,
    setAge: setCurioAge,
    setInterest: setCurioInterest,
  } = useCurio();
  const navigate = useNavigate();
  const [age, setAge] = useState(null);
  const [interest, setInterest] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canDiscover = age !== null && interest !== null && minutes !== null;

  async function handleDiscover() {
    if (!canDiscover || loading) return;
    setLoading(true);
    setError("");

    let timeoutId;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), DISCOVERY_TIMEOUT_MS);
      const response = await fetch("/api/generate-bundle", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({age, interest, minutes}),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload) throw new Error("DISCOVERY_FAILED");

      setCurioAge(age);
      setCurioInterest(interest);
      setBundle(payload);
      navigate("/reveal");
    } catch {
      setError(FRIENDLY_DISCOVERY_ERROR);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-rainbow-blue/70 via-curio-background to-rainbow-pink/50 p-6 text-center text-curio-text md:p-10">
        <div className="relative w-full max-w-md rounded-[2.5rem] border-4 border-white bg-curio-background/95 p-6 shadow-2xl shadow-rainbow-pink/30 backdrop-blur md:p-10">
          <div className="absolute left-10 top-10 h-10 w-10 animate-ping rounded-full bg-rainbow-orange/80" />
          <div className="relative mx-auto flex h-28 w-28 animate-bounce items-center justify-center rounded-full bg-rainbow-purple text-6xl shadow-lg shadow-rainbow-purple/30">
            ✨
          </div>
          <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.24em] text-rainbow-pink">
            Curio is busy
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Discovering...
          </h1>
          <p className="mt-4 text-lg leading-7 text-slate-600">
            Gathering a wonderful activity just for you!
          </p>
          <div
            className="mx-auto mt-8 flex w-32 justify-between"
            aria-label="Loading"
          >
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="h-4 w-4 animate-bounce rounded-full bg-rainbow-orange"
                style={{animationDelay: `${delay}ms`}}
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-rainbow-blue/70 via-curio-background to-rainbow-yellow/50 p-6 text-curio-text md:p-10">
      <div className="pointer-events-none absolute left-12 top-28 h-36 w-36 rounded-full bg-rainbow-orange/60 blur-2xl" />
      <div className="pointer-events-none absolute right-12 top-8 h-44 w-44 rounded-full bg-rainbow-pink/40 blur-2xl" />
      <section className="relative mx-auto max-w-4xl">
        <header className="mb-6 text-center">
          <div className="mx-auto w-fit rounded-[2rem] border-4 border-curio-text bg-curio-background px-7 py-3 shadow-[0_7px_0_#FB923C] md:px-10 md:py-4">
            <p className="text-6xl font-black leading-none tracking-[-0.07em] text-rainbow-pink md:text-8xl">
              Curio
            </p>
          </div>
          <p className="mt-6 text-xl font-extrabold md:text-2xl">
            Let’s make today curious!
          </p>
          <p className="mx-auto mt-4 max-w-xl text-base font-semibold text-slate-600 md:text-lg">
            A tiny discovery box, made for your family’s day.
          </p>
        </header>

        <div className="space-y-6 rounded-[2rem] border-4 border-white bg-curio-background/95 p-5 shadow-2xl shadow-rainbow-blue/20 backdrop-blur md:p-8">
          <section aria-labelledby="age-heading">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-rainbow-pink">
              Step 1
            </p>
            <h2 id="age-heading" className="mt-1 text-2xl font-black">
              How old is your explorer?
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {ageRanges.map((range, index) => (
                <ChoiceButton
                  key={range.label}
                  color={
                    rainbowButtonStyles[index % rainbowButtonStyles.length]
                  }
                  active={age === range.age}
                  onClick={() => setAge(range.age)}
                >
                  <span className="block text-2xl">Ages {range.label}</span>
                  <span
                    className={`mt-1 block text-sm ${age === range.age ? "text-white/85" : "text-slate-500"}`}
                  >
                    {range.detail}
                  </span>
                </ChoiceButton>
              ))}
            </div>
          </section>

          <section aria-labelledby="interest-heading">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-rainbow-blue">
              Step 2
            </p>
            <h2 id="interest-heading" className="mt-1 text-2xl font-black">
              What sounds fun?
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {interests.map((item, index) => (
                <ChoiceButton
                  key={item.label}
                  color={
                    rainbowButtonStyles[index % rainbowButtonStyles.length]
                  }
                  active={interest === item.value}
                  onClick={() => setInterest(item.value)}
                  className="min-h-32 text-center"
                >
                  <span className="block text-4xl" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="mt-2 block leading-tight">{item.label}</span>
                </ChoiceButton>
              ))}
            </div>
          </section>

          <section aria-labelledby="time-heading">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-rainbow-orange">
              Step 3
            </p>
            <h2 id="time-heading" className="mt-1 text-2xl font-black">
              How much time do you have?
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {timeOptions.map((option, index) => (
                <ChoiceButton
                  key={option}
                  color={
                    rainbowButtonStyles[index % rainbowButtonStyles.length]
                  }
                  active={minutes === option}
                  onClick={() => setMinutes(option)}
                  className="text-center"
                >
                  <span className="block text-xl">{option} min</span>
                </ChoiceButton>
              ))}
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="space-y-3 rounded-2xl bg-rose-100 p-5 font-semibold text-rose-800"
            >
              <p>{error}</p>
              <button
                type="button"
                onClick={handleDiscover}
                className="rounded-full border-2 border-rose-300 bg-white px-4 py-2 text-sm font-extrabold text-rose-800 transition-colors duration-200 hover:bg-rose-50 focus:outline-none focus:ring-4 focus:ring-rose-300/50"
              >
                Try again
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={handleDiscover}
            disabled={!canDiscover}
            className="w-full rounded-3xl bg-gradient-to-r from-rainbow-purple via-rainbow-pink to-rainbow-red px-6 py-5 text-xl font-black text-white shadow-lg shadow-rainbow-pink/30 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-rainbow-blue/50 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none"
          >
            Open my discovery box ✨
          </button>
          <p className="text-center text-sm font-semibold text-slate-600">
            Choose one from each step to begin.
          </p>
        </div>
      </section>
    </main>
  );
}
