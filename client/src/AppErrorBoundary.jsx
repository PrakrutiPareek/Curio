import React from "react";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError() {
    return {hasError: true};
  }

  componentDidCatch(error) {
    // Keep details in the console for developers while showing a friendly UI to kids.
    console.error("Curio UI crashed:", error);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-rainbow-blue/60 via-curio-background to-rainbow-pink/50 p-6 text-center text-curio-text md:p-10">
          <div className="w-full max-w-xl rounded-[2.5rem] border-4 border-white bg-curio-background/95 p-6 shadow-2xl shadow-rainbow-blue/25 md:p-10">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-rainbow-pink">
              Curio timeout corner
            </p>
            <h1 className="mt-4 text-3xl font-black text-rainbow-purple md:text-5xl">
              Oops! Curio tripped over a toy.
            </h1>
            <p className="mt-4 text-lg font-semibold text-slate-700 md:text-xl">
              Let&apos;s reload and jump back into your adventure!
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-8 rounded-3xl bg-gradient-to-r from-rainbow-purple via-rainbow-pink to-rainbow-red px-8 py-4 text-lg font-black text-white shadow-lg shadow-rainbow-pink/30 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-rainbow-blue/50"
            >
              Reload
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
