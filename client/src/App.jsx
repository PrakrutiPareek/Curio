import { useState } from 'react'
import ActivityScreen from './ActivityScreen.jsx'
import OnboardingScreen from './OnboardingScreen.jsx'
import RevealScreen from './RevealScreen.jsx'

function App() {
  const [bundle, setBundle] = useState(null)
  const [screen, setScreen] = useState('reveal')

  if (!bundle) return <OnboardingScreen onBundleReady={(nextBundle) => { setBundle(nextBundle); setScreen('reveal') }} />

  if (screen === 'activity') return <ActivityScreen experiment={bundle.experiment} onBack={() => setScreen('reveal')} />

  return <RevealScreen bundle={bundle} onNewDiscovery={() => setBundle(null)} onStartActivity={() => setScreen('activity')} />
}

export default App
