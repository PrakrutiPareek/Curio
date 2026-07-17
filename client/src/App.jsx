import { useState } from 'react'
import OnboardingScreen from './OnboardingScreen.jsx'

function App() {
  const [bundle, setBundle] = useState(null)

  if (!bundle) return <OnboardingScreen onBundleReady={setBundle} />

  return (
    <main className="flex min-h-screen items-center justify-center bg-violet-50 px-6 py-12 text-center text-slate-800">
      <section className="max-w-xl rounded-[2rem] bg-white p-8 shadow-xl">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-violet-600">Your discovery box</p>
        <h1 className="mt-3 text-4xl font-black">{bundle.theme} {bundle.emoji}</h1>
        <p className="mt-5 text-lg text-slate-600">{bundle.fact}</p>
        <button type="button" onClick={() => setBundle(null)} className="mt-8 rounded-full bg-violet-500 px-5 py-3 font-bold text-white">Make another box</button>
      </section>
    </main>
  )
}

export default App
