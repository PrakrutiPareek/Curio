import {Navigate, Route, Routes} from "react-router-dom";
import {CurioProvider} from "./CurioContext.jsx";
import ActivityScreen from "./ActivityScreen.jsx";
import OnboardingScreen from "./OnboardingScreen.jsx";
import RevealScreen from "./RevealScreen.jsx";

function App() {
  return (
    <CurioProvider>
      <Routes>
        <Route path="/" element={<OnboardingScreen />} />
        <Route path="/reveal" element={<RevealScreen />} />
        <Route path="/activity" element={<ActivityScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CurioProvider>
  );
}

export default App;
