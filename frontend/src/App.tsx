import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FeatureAnalysisPage from './components/FeatureAnalysisPage';
import LiveMonitoringPage from './components/LiveMonitoringPage';
import RetrainingRecommendationPage from './components/RetrainingRecommendationPage';
import AlertConfigurationPage from './components/AlertConfigurationPage';
import HistoricalTrendsPage from './components/HistoricalTrendsPage';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Profile from './components/Profile';

type View = 'dashboard' | 'feature-analysis' | 'live' | 'retraining' | 'alerts' | 'trends' | 'signin' | 'signup' | 'profile';

function App() {
  const [currentView, setCurrentView] = useState<View>('signin');

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-[#ecf0f1] font-sans pb-8">
      {/* Hide Header on Auth pages */}
      {currentView !== 'signin' && currentView !== 'signup' && (
        <Header onNavigate={setCurrentView} currentView={currentView} />
      )}
      
      <main>
        {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} />}
        {currentView === 'feature-analysis' && <FeatureAnalysisPage onBack={() => setCurrentView('dashboard')} />}
        {currentView === 'live' && <LiveMonitoringPage />}
        {currentView === 'retraining' && <RetrainingRecommendationPage onBack={() => setCurrentView('dashboard')} />}
        {currentView === 'alerts' && <AlertConfigurationPage />}
        {currentView === 'trends' && <HistoricalTrendsPage />}
        
        {/* New Pages */}
        {currentView === 'signin' && <Signin onNavigate={setCurrentView} />}
        {currentView === 'signup' && <Signup onNavigate={setCurrentView} />}
        {currentView === 'profile' && <Profile onNavigate={setCurrentView} />}
      </main>
    </div>
  );
}

export default App;
