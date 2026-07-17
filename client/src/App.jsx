import { useState } from 'react'

function App() {
  const [bundle, setBundle] = useState(null)
  const [loading, setLoading] = useState(false)

  async function generateBundle() {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-bundle', { method: 'POST' })
      setBundle(await response.json())
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-amber-50 px-6 py-16 text-slate-800">
      <section className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-amber-600">Curio</p>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">A daily box for curious kids.</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600">
          Fun facts, jokes, and mini experiments—wrapped around one delightful theme.
        </p>
        <button
          className="mt-10 rounded-full bg-amber-500 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-70"
          onClick={generateBundle}
          disabled={loading}
        >
          {loading ? 'Opening your box…' : 'Generate a discovery box'}
        </button>
        {bundle && (
          <p className="mt-6 rounded-xl bg-white p-4 text-slate-700 shadow-sm">
            {bundle.message}
          </p>
        )}
      </section>
    </main>
  )
}

export default App
