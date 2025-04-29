import React, { useState, useEffect } from 'react';
import { PlusCircle, Gauge, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { SmartMeter, SmartMeterReading } from '../types';
import { v4 as uuidv4 } from 'uuid';

const DEMO_METERS: SmartMeter[] = [
  {
    id: '1',
    name: 'Hauptgebäude Zähler',
    location: 'Erdgeschoss, Raum E.01',
    status: 'connected',
    lastReading: {
      timestamp: new Date(),
      value: 45.67,
      unit: 'kWh'
    }
  },
  {
    id: '2',
    name: 'Produktionshalle Nord',
    location: 'Halle N, Verteilerkasten 2',
    status: 'connected',
    lastReading: {
      timestamp: new Date(),
      value: 128.34,
      unit: 'kWh'
    }
  }
];

const SmartMeterModule: React.FC = () => {
  const [meters, setMeters] = useState<SmartMeter[]>(DEMO_METERS);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMeterName, setNewMeterName] = useState('');
  const [newMeterLocation, setNewMeterLocation] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setMeters(currentMeters => 
        currentMeters.map(meter => ({
          ...meter,
          lastReading: meter.status === 'connected' ? {
            timestamp: new Date(),
            value: meter.lastReading ? 
              meter.lastReading.value + (Math.random() * 2 - 1) : 
              Math.random() * 100,
            unit: 'kWh'
          } : meter.lastReading
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAddMeter = () => {
    if (newMeterName && newMeterLocation) {
      const newMeter: SmartMeter = {
        id: uuidv4(),
        name: newMeterName,
        location: newMeterLocation,
        status: 'connected',
        lastReading: {
          timestamp: new Date(),
          value: Math.random() * 100,
          unit: 'kWh'
        }
      };
      setMeters([...meters, newMeter]);
      setShowAddDialog(false);
      setNewMeterName('');
      setNewMeterLocation('');
    }
  };

  const toggleMeterStatus = (meterId: string) => {
    setMeters(currentMeters =>
      currentMeters.map(meter =>
        meter.id === meterId
          ? { ...meter, status: meter.status === 'connected' ? 'disconnected' : 'connected' }
          : meter
      )
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Gauge className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Smart Meter Verwaltung</h2>
        </div>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Zähler hinzufügen</span>
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {meters.map(meter => (
          <div
            key={meter.id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{meter.name}</h3>
                <p className="text-sm text-gray-500">{meter.location}</p>
              </div>
              <button
                onClick={() => toggleMeterStatus(meter.id)}
                className={`p-2 rounded-full ${
                  meter.status === 'connected'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {meter.status === 'connected' ? (
                  <Wifi className="w-4 h-4" />
                ) : (
                  <WifiOff className="w-4 h-4" />
                )}
              </button>
            </div>

            {meter.lastReading && meter.status === 'connected' ? (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Letzter Messwert:</span>
                  <span className="font-medium text-gray-900">
                    {meter.lastReading.value.toFixed(2)} {meter.lastReading.unit}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Aktualisiert: {meter.lastReading.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>Keine Daten verfügbar</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Neuen Smart Meter hinzufügen</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newMeterName}
                  onChange={(e) => setNewMeterName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="z.B. Hauptgebäude Zähler"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Standort
                </label>
                <input
                  type="text"
                  value={newMeterLocation}
                  onChange={(e) => setNewMeterLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="z.B. Erdgeschoss, Raum E.01"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleAddMeter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Hinzufügen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartMeterModule;