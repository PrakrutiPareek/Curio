import {useNavigate} from "react-router-dom";
import {BADGE_CATEGORIES, getEarnedBadges, hasBadge} from "./badgeStorage.js";

// Cycle the rainbow palette across the 9 badge cards
const CARD_COLORS = [
  {tint: "border-rainbow-red bg-rainbow-red/20", label: "text-red-800"},
  {
    tint: "border-rainbow-orange bg-rainbow-orange/20",
    label: "text-orange-800",
  },
  {tint: "border-rainbow-yellow bg-rainbow-yellow/25", label: "text-amber-800"},
  {tint: "border-rainbow-green bg-rainbow-green/20", label: "text-green-800"},
  {tint: "border-rainbow-blue bg-rainbow-blue/20", label: "text-sky-800"},
  {
    tint: "border-rainbow-purple bg-rainbow-purple/20",
    label: "text-violet-800",
  },
  {tint: "border-rainbow-pink bg-rainbow-pink/20", label: "text-pink-800"},
  {tint: "border-rainbow-red bg-rainbow-red/20", label: "text-red-800"},
  {
    tint: "border-rainbow-orange bg-rainbow-orange/20",
    label: "text-orange-800",
  },
];

export default function BadgeScreen() {
  const navigate = useNavigate();
  const earned = getEarnedBadges();
  const earnedCount = earned.length;
  const total = BADGE_CATEGORIES.length;

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-rainbow-pink/30 via-curio-background to-rainbow-blue/30 p-6 text-curio-text md:p-10">
      {/* Decorative blurs */}
      <div className="pointer-events-none absolute left-12 top-28 h-36 w-36 rounded-full bg-rainbow-yellow/40 blur-2xl" />
      <div className="pointer-events-none absolute right-12 top-8 h-44 w-44 rounded-full bg-rainbow-green/30 blur-2xl" />

      <section className="relative mx-auto max-w-4xl">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-0 top-0 z-10 rounded-full border-2 border-rainbow-purple bg-rainbow-purple/20 px-4 py-3 text-sm font-extrabold text-curio-text shadow-md transition-colors duration-200 hover:bg-rainbow-purple hover:text-white focus:outline-none focus:ring-4 focus:ring-rainbow-blue/50"
        >
          ← Back
        </button>

        <header className="flex flex-col items-center pt-16 text-center md:pt-20">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-rainbow-pink">
            Your collection
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-rainbow-purple md:text-5xl">
            Badge Shelf 🏅
          </h1>

          {/* Summary counter */}
          <div className="mt-6 rounded-[2rem] border-2 border-rainbow-orange bg-rainbow-orange/20 px-6 py-4 shadow-md">
            <p className="text-xl font-extrabold text-orange-800 md:text-2xl">
              {earnedCount === total
                ? "All 9 badges collected! You're a Curio champion! 🏆"
                : `${earnedCount} of ${total} badges collected!`}
            </p>
          </div>
        </header>

        {/* Badge grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {BADGE_CATEGORIES.map((cat, i) => {
            const isEarned = hasBadge(cat.key);
            const color = CARD_COLORS[i];

            return (
              <div
                key={cat.key}
                className={`flex flex-col items-center gap-3 rounded-[2rem] border-2 p-5 shadow-md transition-transform duration-200 ${
                  isEarned
                    ? `${color.tint} scale-100`
                    : "border-slate-200 bg-slate-100"
                }`}
              >
                {/* Icon */}
                <span
                  aria-hidden="true"
                  className={`text-5xl leading-none transition-all duration-300 ${
                    isEarned ? "" : "opacity-30 grayscale"
                  }`}
                >
                  {cat.icon}
                </span>

                {/* Label */}
                <p
                  className={`text-center text-base font-extrabold leading-tight ${
                    isEarned ? color.label : "text-slate-400"
                  }`}
                >
                  {cat.label}
                </p>

                {/* Status pill */}
                {isEarned ? (
                  <span
                    className={`rounded-full bg-curio-background px-3 py-1 text-xs font-extrabold uppercase tracking-widest shadow-sm ${color.label}`}
                  >
                    Earned ✓
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    🔒 Locked
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {earnedCount === 0 && (
          <p className="mt-8 text-center text-lg font-semibold text-slate-500">
            Complete an activity to earn your first badge!
          </p>
        )}
      </section>
    </main>
  );
}
