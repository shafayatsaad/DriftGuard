import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FeatureAnalysisPage from './components/FeatureAnalysisPage';
import LiveMonitoringPage from './components/LiveMonitoringPage';
import RetrainingRecommendationPage from './components/RetrainingRecommendationPage';
import AlertConfigurationPage from './components/AlertConfigurationPage';
import HistoricalTrendsPage from './components/HistoricalTrendsPage';

type View = 'dashboard' | 'feature-analysis' | 'live' | 'retraining' | 'alerts' | 'trends';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-[#ecf0f1] font-sans pb-8">
      <Header onNavigate={setCurrentView} currentView={currentView} />
      
      <main>
        {currentView === 'dashboard' && (
          <Dashboard onNavigate={setCurrentView} />
        )}
        {currentView === 'feature-analysis' && (
          <FeatureAnalysisPage onBack={() => setCurrentView('dashboard')} />
        )}
        {currentView === 'live' && (
          <LiveMonitoringPage />
        )}
        {currentView === 'retraining' && (
          <RetrainingRecommendationPage onBack={() => setCurrentView('dashboard')} />
        )}
        {currentView === 'alerts' && (
          <AlertConfigurationPage />
        )}
        {currentView === 'trends' && (
          <HistoricalTrendsPage />
        )}
      </main>
    </div>
  );
}

export default App;
