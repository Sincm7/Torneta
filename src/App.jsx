import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import LandingPage from './pages/Landing.jsx';
import PricingPage from './pages/Pricing.jsx';
import AnalyzePage from './pages/Analyze.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="analyze" element={<AnalyzePage />} />
      </Route>
    </Routes>
  );
}
