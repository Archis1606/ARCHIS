import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import IntroSection from './components/IntroSection';
import ProcessSection from './components/ProcessSection';
import HowItWorks from './components/HowItWorks';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LandParcelDetailsPage from './components/LandParcelDetails/LandParcelDetailsPage';
import { useScrollReveal } from './hooks/useScrollReveal';

function App() {
  useScrollReveal();

  return (
    <Router>
      <div className="relative min-h-screen bg-[#0a0a0a] text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <IntroSection />
              <ProcessSection />
              <HowItWorks />
              <FinalCTA />
              <Footer />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/land/:landPin" element={<LandParcelDetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;