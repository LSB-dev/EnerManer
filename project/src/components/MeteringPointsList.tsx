import React from 'react';
import { MeteringPoint } from '../types';
import { ArrowRight, Upload, Gauge, FileText } from 'lucide-react';
import StatusIndicator from './StatusIndicator';
import { useNavigate } from 'react-router-dom';

interface MeteringPointsListProps {
  meteringPoints: MeteringPoint[];
  plantId: string;
}

const MeteringPointsList: React.FC<MeteringPointsListProps> = ({ meteringPoints, plantId }) => {
  const navigate = useNavigate();

  const handleMeteringPointClick = (meteringPointId: string) => {
    navigate(`/verbrauchsdaten?plant=${plantId}&meteringPoint=${meteringPointId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Messstellen</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {meteringPoints.map((point) => (
          <div
            key={point.id}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">{point.name}</h4>
                  <StatusIndicator status={point.status} />
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    point.reportingMethod === 'smartmeter' 
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {point.reportingMethod === 'smartmeter' ? (
                      <>
                        <Gauge className="w-3 h-3" />
                        <span>Smart Meter</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3 h-3" />
                        <span>Manuell</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Messstellen-ID:</span> {point.meteringPointId}
                  </div>
                  <div>
                    <span className="font-medium">Rechnungsempfänger-ID:</span> {point.billingRecipientId}
                  </div>
                  <div>
                    <span className="font-medium">Institut:</span> {point.institute}
                  </div>
                  <div>
                    <span className="font-medium">Letztverbraucher:</span> {point.endConsumer}
                  </div>
                  <div>
                    <span className="font-medium">Jahr:</span> {point.year}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleMeteringPointClick(point.id)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm ml-4"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Erfassen</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeteringPointsList;