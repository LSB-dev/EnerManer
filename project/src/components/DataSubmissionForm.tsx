import React, { useState } from 'react';
import { Building2, Zap, Flame } from 'lucide-react';

interface DataSubmissionFormProps {
  plantId: string;
  plantName: string;
  onSubmit: (data: { electricity: number; gas: number }) => void;
}

const DataSubmissionForm: React.FC<DataSubmissionFormProps> = ({ plantId, plantName, onSubmit }) => {
  const [electricity, setElectricity] = useState<string>('');
  const [gas, setGas] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const electricityValue = parseFloat(electricity);
    const gasValue = parseFloat(gas);

    if (isNaN(electricityValue) || isNaN(gasValue)) {
      setError('Bitte geben Sie gültige Zahlen ein');
      return;
    }

    if (electricityValue < 0 || gasValue < 0) {
      setError('Die Werte dürfen nicht negativ sein');
      return;
    }

    onSubmit({
      electricity: electricityValue,
      gas: gasValue
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Building2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-900">{plantName}</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Bitte geben Sie die aktuellen Verbrauchsdaten für {plantName} ein.
          Die Daten werden nach der Übermittlung automatisch validiert und verarbeitet.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span className="text-gray-700 font-medium">Stromverbrauch (MWh)</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={electricity}
                  onChange={(e) => setElectricity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  required
                />
              </label>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block">
                <div className="flex items-center space-x-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700 font-medium">Gasverbrauch (MWh)</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={gas}
                  onChange={(e) => setGas(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  required
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Daten übermitteln
          </button>
        </form>
      </div>
    </div>
  );
};

export default DataSubmissionForm;