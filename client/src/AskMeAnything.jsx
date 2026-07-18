import {useState, useRef, useEffect} from "react";

const bubbleStyles = [
  {
    card: "border-rainbow-blue bg-rainbow-blue/20",
    inner: "border-rainbow-blue bg-curio-background/80",
    label: "text-sky-700",
  },
  {
    card: "border-rainbow-purple bg-rainbow-purple/20",
    inner: "border-rainbow-purple bg-curio-background/80",
    label: "text-violet-700",
  },
  {
    card: "border-rainbow-pink bg-rainbow-pink/20",
    inner: "border-rainbow-pink bg-curio-background/80",
    label: "text-pink-700",
  },
];

export default function AskMeAnything({theme, age}) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]); // [{ question, answer }], max 3, newest first
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // Focus textarea when panel opens
  useEffect(() => {
    if (open) {
      // Small delay so the CSS transition has started
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [open]);

  // Trap scroll: prevent body scroll while panel is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ask-anything", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({question: q, theme, age}),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        throw new Error(
          data?.error || "Could not get an answer. Please try again!",
        );
      }
      setHistory((prev) =>
        [{question: q, answer: data.answer}, ...prev].slice(0, 3),
      );
      setQuestion("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setError("");
  }

  return (
    <>
      {/* Floating trigger button — bottom-centred, prominent CTA */}
      <div className="pointer-events-none fixed bottom-6 left-0 right-0 z-40 flex justify-start px-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="animate-ama-float pointer-events-auto flex items-center gap-3 rounded-full border-2 border-rainbow-orange bg-rainbow-orange px-7 py-4 text-lg font-extrabold text-white shadow-xl shadow-rainbow-orange/50 transition-colors duration-200 hover:[animation-play-state:paused] hover:border-rainbow-yellow hover:bg-rainbow-yellow hover:text-curio-text focus:outline-none focus:ring-4 focus:ring-rainbow-blue/50"
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            💬
          </span>
          Ask a question!
        </button>
      </div>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={handleClose}
        className={`fixed inset-0 z-40 bg-curio-text/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Slide-up panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Ask me anything"
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-[2rem] border-t-4 border-rainbow-purple bg-curio-background shadow-2xl shadow-rainbow-purple/30 transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-6 md:p-8">
          {/* Drag handle (visual only) */}
          <div
            aria-hidden="true"
            className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-slate-300"
          />

          {/* Panel header */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-rainbow-pink">
                Curio wonders
              </p>
              <h2 className="mt-1 text-2xl font-black text-rainbow-purple md:text-3xl">
                Ask me anything!
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close ask me anything panel"
              className="shrink-0 rounded-full border-2 border-rainbow-purple bg-rainbow-purple/20 px-4 py-2 text-sm font-extrabold text-curio-text transition-colors duration-200 hover:bg-rainbow-purple hover:text-white focus:outline-none focus:ring-4 focus:ring-rainbow-blue/50"
            >
              Close
            </button>
          </div>

          {/* Q&A history — newest first */}
          {history.length > 0 && (
            <div className="mb-6 space-y-4" aria-label="Recent questions">
              {history.map((item, i) => {
                const style = bubbleStyles[i % bubbleStyles.length];
                return (
                  <article
                    key={i}
                    className={`rounded-[1.5rem] border-2 p-5 shadow-md ${style.card}`}
                  >
                    <p
                      className={`mb-2 text-xs font-extrabold uppercase tracking-[0.16em] ${style.label}`}
                    >
                      You asked
                    </p>
                    <p className="text-base font-bold text-curio-text">
                      {item.question}
                    </p>

                    {/* Speech-bubble answer card */}
                    <div
                      className={`mt-4 rounded-2xl border-2 p-4 ${style.inner}`}
                    >
                      <p
                        className={`mb-2 text-xs font-extrabold uppercase tracking-[0.16em] ${style.label}`}
                      >
                        Curio says
                      </p>
                      <p className="text-base font-semibold leading-7 text-curio-text">
                        {item.answer}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Input form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <label
              htmlFor="ama-input"
              className="block text-sm font-extrabold uppercase tracking-[0.16em] text-rainbow-blue"
            >
              What do you want to know?
            </label>

            <textarea
              id="ama-input"
              ref={inputRef}
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
              placeholder={`Ask anything about ${theme || "today's topic"}…`}
              className="w-full resize-none rounded-2xl border-2 border-rainbow-blue bg-white p-4 text-lg font-semibold text-curio-text placeholder-slate-400 shadow-inner transition-colors duration-200 focus:border-rainbow-purple focus:outline-none focus:ring-4 focus:ring-rainbow-blue/30 disabled:opacity-50"
            />

            {error && (
              <p
                role="alert"
                className="rounded-2xl border-2 border-rainbow-red bg-rainbow-red/15 p-3 text-sm font-bold text-red-800"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="w-full rounded-3xl bg-gradient-to-r from-rainbow-purple via-rainbow-pink to-rainbow-red py-4 text-lg font-black text-white shadow-lg shadow-rainbow-pink/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-rainbow-blue/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
            >
              {loading ? (
                <span
                  className="flex items-center justify-center gap-2"
                  aria-label="Loading answer"
                >
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="h-3 w-3 animate-bounce rounded-full bg-white/80"
                      style={{animationDelay: `${delay}ms`}}
                    />
                  ))}
                </span>
              ) : (
                "Get Answer"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
