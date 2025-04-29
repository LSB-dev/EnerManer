import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FileUploadZone from '../components/FileUploadZone';
import { Building2, Upload, ArrowLeft, CalendarIcon, Zap, Flame, MessageSquarePlus } from 'lucide-react';
import { PlantComment, ConsumptionData, ElectricityData, MeteringPoint } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { fetchWerk } from '../api';              // ★ NEW

const emptyElectricityData = (): ElectricityData => ({
  total: '',
  peak: '',
  offPeak: '',
  peakPower: '',
  supplier: ''
});

const demoMeteringPoints: { [key: string]: MeteringPoint } = {
  'mp1': {
    id: 'mp1',
    name: 'Hauptzähler',
    meteringPointId: '–',
    billingRecipientId: '–',
    institute: '–',
    endConsumer: '-',
    year: new Date().getFullYear(),
    status: 'pending',
    reportingMethod: 'manual'
  },
  'mp2': {
    id: 'mp2',
    name: 'Produktionshalle',
    meteringPointId: 'DE00012346',
    billingRecipientId: 'RE98766',
    institute: 'Institut B',
    endConsumer: 'Werk001 GmbH',
    year: 2025,
    status: 'pending',
    reportingMethod: 'manual'
  },
  'mp3': {
    id: 'mp3',
    name: 'Hauptzähler',
    meteringPointId: 'DE00023456',
    billingRecipientId: 'RE87654',
    institute: 'Institut C',
    endConsumer: 'Werk002 GmbH',
    year: 2025,
    status: 'pending',
    reportingMethod: 'manual'
  },
  'mp4': {
    id: 'mp4',
    name: 'Produktionshalle Nord',
    meteringPointId: 'DE00023457',
    billingRecipientId: 'RE87655',
    institute: 'Institut C',
    endConsumer: 'Werk002 GmbH',
    year: 2025,
    status: 'none',
    reportingMethod: 'smartmeter'
  }
};

const VerbrauchsdatenPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plantId = searchParams.get('plant');
  const meteringPointId = searchParams.get('meteringPoint');
  const [isProcessing, setIsProcessing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<PlantComment[]>([]);
  const [meteringPoint, setMeteringPoint] = useState<MeteringPoint | null>(null);
  const [consumptionData, setConsumptionData] = useState<ConsumptionData>({
    currentYear: {
      electricity: emptyElectricityData(),
      gas: '',
      gasSupplier: ''
    },
    forecast: {
      electricity: emptyElectricityData(),
      gas: '',
      gasSupplier: ''
    }
  });
  const [error, setError] = useState<{ current: string | null; forecast: string | null }>({
    current: null,
    forecast: null
  });


  useEffect(() => {                               // ★ NEW block
    (async () => {
      try {
        const data = await fetchWerk();
        setMeteringPoint({
          id:              data.messstellenId.toString(),
          name:            'Hauptzähler',
          meteringPointId: data.messstellenId.toString(),
          billingRecipientId: data.rechnungsempfaengerId.toString(),
          institute:       data.institut,
          endConsumer:     data.endConsumer.toString(),
          year:            new Date().getFullYear(),
          status:          'none',
          reportingMethod: 'smartmeter'
        });
      } catch (e) {
        console.error('Fehler beim Laden der SQLite-Daten', e);
      }
    })();
  }, []); 

  useEffect(() => {
    if (meteringPointId && demoMeteringPoints[meteringPointId]) {
      setMeteringPoint(demoMeteringPoints[meteringPointId]);
    }

    if (plantId) {
      setComments([
        {
          id: '1',
          text: 'Wartungsarbeiten vom 15.03 bis 29.03',
          timestamp: new Date('2025-03-10T10:30:00')
        }
      ]);
    }
  }, [plantId, meteringPointId]);

  const handleFilesSelected = async (files: File[]) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/');
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const validateElectricityValues = (data: ElectricityData): boolean => {
    const values = Object.values(data).map(v => parseFloat(v));
    if (values.some(isNaN)) return false;
    if (values.some(v => v < 0)) return false;
    
    const [total, peak, offPeak] = values;
    if (peak + offPeak > total) return false;
    
    return true;
  };

  const handleCurrentYearSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError({ ...error, current: null });

    const { electricity, gas } = consumptionData.currentYear;
    const gasValue = parseFloat(gas);

    if (!validateElectricityValues(electricity)) {
      setError({ ...error, current: 'Bitte überprüfen Sie die Stromverbrauchswerte' });
      return;
    }

    if (isNaN(gasValue) || gasValue < 0) {
      setError({ ...error, current: 'Bitte geben Sie einen gültigen Gasverbrauch ein' });
      return;
    }

    console.log('Submitting current year data:', consumptionData.currentYear);
    navigate('/');
  };

  const handleForecastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError({ ...error, forecast: null });

    const { electricity, gas } = consumptionData.forecast;
    const gasValue = parseFloat(gas);

    if (!validateElectricityValues(electricity)) {
      setError({ ...error, forecast: 'Bitte überprüfen Sie die Stromverbrauchswerte' });
      return;
    }

    if (isNaN(gasValue) || gasValue < 0) {
      setError({ ...error, forecast: 'Bitte geben Sie einen gültigen Gasverbrauch ein' });
      return;
    }

    console.log('Submitting forecast data:', consumptionData.forecast);
    navigate('/');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment: PlantComment = {
        id: uuidv4(),
        text: newComment.trim(),
        timestamp: new Date()
      };
      setComments(prev => [...prev, comment]);
      setNewComment('');
    }
  };

  const updateElectricityData = (
    year: 'currentYear' | 'forecast',
    field: keyof ElectricityData,
    value: string
  ) => {
    setConsumptionData(prev => ({
      ...prev,
      [year]: {
        ...prev[year],
        electricity: {
          ...prev[year].electricity,
          [field]: value
        }
      }
    }));
  };

  const updateGasData = (
    year: 'currentYear' | 'forecast',
    field: 'gas' | 'gasSupplier',
    value: string
  ) => {
    setConsumptionData(prev => ({
      ...prev,
      [year]: {
        ...prev[year],
        [field]: value
      }
    }));
  };

  const renderElectricityFields = (year: 'currentYear' | 'forecast') => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Wert (kWh)</span>
          </div>
        </label>
        <input
          type="number"
          step="0.01"
          value={consumptionData[year].electricity.total}
          onChange={(e) => updateElectricityData(year, 'total', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <span>davon Peak (kWh)</span>
        </label>
        <input
          type="number"
          step="0.01"
          value={consumptionData[year].electricity.peak}
          onChange={(e) => updateElectricityData(year, 'peak', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <span>davon Off-Peak (kWh)</span>
        </label>
        <input
          type="number"
          step="0.01"
          value={consumptionData[year].electricity.offPeak}
          onChange={(e) => updateElectricityData(year, 'offPeak', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <span>Peak (kW)</span>
        </label>
        <input
          type="number"
          step="0.01"
          value={consumptionData[year].electricity.peakPower}
          onChange={(e) => updateElectricityData(year, 'peakPower', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <span>Lieferant</span>
        </label>
        <input
          type="text"
          value={consumptionData[year].electricity.supplier}
          onChange={(e) => updateElectricityData(year, 'supplier', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Stromlieferant"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Zurück zum Dashboard</span>
        </button>

        {meteringPoint && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Messstelle: {meteringPoint.name}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Messstellen-ID:</span>{' '}
                <span className="text-gray-900">{meteringPoint.meteringPointId}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Rechnungsempfänger-ID:</span>{' '}
                <span className="text-gray-900">{meteringPoint.billingRecipientId}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Institut:</span>{' '}
                <span className="text-gray-900">{meteringPoint.institute}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Letztverbraucher:</span>{' '}
                <span className="text-gray-900">{meteringPoint.endConsumer}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Jahr:</span>{' '}
                <span className="text-gray-900">{meteringPoint.year}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <MessageSquarePlus className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Kommentare</h2>
            </div>

            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Neuer Kommentar..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300"
                >
                  Hinzufügen
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{comment.text}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {comment.timestamp.toLocaleString('de-DE')}
                  </p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-gray-500 italic">Keine Kommentare vorhanden</p>
              )}
            </div>
          </div>

          {/* Current Year Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Building2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Aktuelles Jahr (2025)</h1>
            </div>

            <form onSubmit={handleCurrentYearSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Stromverbrauch</h3>
                  {renderElectricityFields('currentYear')}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Gasverbrauch</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center space-x-2">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span>Gasverbrauch (MWh)</span>
                        </div>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={consumptionData.currentYear.gas}
                        onChange={(e) => updateGasData('currentYear', 'gas', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span>Lieferant</span>
                      </label>
                      <input
                        type="text"
                        value={consumptionData.currentYear.gasSupplier}
                        onChange={(e) => updateGasData('currentYear', 'gasSupplier', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Gaslieferant"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error.current && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error.current}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Aktuelle Daten übermitteln
              </button>
            </form>
          </div>

          {/* Forecast Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Building2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Prognose für 2026</h1>
            </div>

            <form onSubmit={handleForecastSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Stromverbrauch</h3>
                  {renderElectricityFields('forecast')}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Gasverbrauch</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center space-x-2">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span>Gasverbrauch (MWh)</span>
                        </div>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={consumptionData.forecast.gas}
                        onChange={(e) => updateGasData('forecast', 'gas', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span>Lieferant</span>
                      </label>
                      <input
                        type="text"
                        value={consumptionData.forecast.gasSupplier}
                        onChange={(e) => updateGasData('forecast', 'gasSupplier', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Gaslieferant"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error.forecast && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error.forecast}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Prognose übermitteln
              </button>
            </form>
          </div>

          {/* File Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Upload className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Oder Verbrauchsdaten hochladen</h2>
            </div>

            <p className="text-gray-600 mb-8">
              Laden Sie Ihre Energieverbrauchsberichte hier hoch. 
              Unterstützte Formate sind PDF, Excel (XLSX/XLS) und CSV.
              Die Daten werden automatisch extrahiert und verarbeitet.
            </p>

            <FileUploadZone
              onFilesSelected={handleFilesSelected}
              isProcessing={isProcessing}
              acceptedFileTypes={['.pdf', '.xlsx', '.xls', '.csv']}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerbrauchsdatenPage;