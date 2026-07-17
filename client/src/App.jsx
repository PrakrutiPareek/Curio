import { useState } from 'react'
import OnboardingScreen from './OnboardingScreen.jsx'
import RevealScreen from './RevealScreen.jsx'

function App() {
  const [bundle, setBundle] = useState(null)

  if (!bundle) return <OnboardingScreen onBundleReady={setBundle} />

  return <RevealScreen bundle={bundle} onNewDiscovery={() => setBundle(null)} onStartActivity={() => {}} />
}

export default App
