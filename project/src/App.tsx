import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Building2, Settings, Bell } from 'lucide-react';
import EnergyProcurementDashboard from './components/EnergyProcurementDashboard';
import SubmissionPage from './pages/SubmissionPage';
import VerbrauchsdatenPage from './pages/VerbrauchsdatenPage';

function MainContent() {
  const [notifications] = useState([
    { id: 1, message: 'Berichte für Januar wurden archiviert', type: 'success' },
    { id: 2, message: 'Bericht für Februar steht noch aus', type: 'warning' }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">EnerManer</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <button className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 py-2 hidden group-hover:block">
                  {notifications.map(notification => (
                    <div key={notification.id} className="px-4 py-2 hover:bg-gray-50">
                      <p className={`text-sm ${
                        notification.type === 'success' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {notification.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            EnerManer Energiebeschaffung
          </h1>
          <div className="bg-white rounded-lg p-8 max-w-7xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
              Willkommen im Energiebeschaffungs-Portal. Hier können Sie Ihre Energieverbrauchsdaten verwalten und analysieren.
            </p>
          </div>
        </header>

        <div className="w-full">
          <EnergyProcurementDashboard />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/submit/:plantId/:token" element={<SubmissionPage />} />
        <Route path="/verbrauchsdaten" element={<VerbrauchsdatenPage />} />
        <Route path="/" element={<MainContent />} />
      </Routes>
    </Router>
  );
}

export default App;