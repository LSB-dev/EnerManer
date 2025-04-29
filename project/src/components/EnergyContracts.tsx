import React from 'react';
import { FileText, Zap, Flame } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { EnergyContract } from '../types';

interface EnergyContractsProps {
  contracts: EnergyContract[];
}

const EnergyContracts: React.FC<EnergyContractsProps> = ({ contracts }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Energieverträge</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Art</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieferant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laufzeit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volumen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fix/Variabel</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {contracts.map((contract) => (
              <tr key={contract.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {contract.type === 'electricity' ? (
                      <Zap className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Flame className="w-4 h-4 text-orange-500" />
                    )}
                    <span className="text-sm text-gray-900">
                      {contract.type === 'electricity' ? 'Strom' : 'Gas'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{contract.supplier}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {format(contract.startDate, 'dd.MM.yyyy', { locale: de })} - {format(contract.endDate, 'dd.MM.yyyy', { locale: de })}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {contract.volume.toLocaleString('de-DE')} {contract.type === 'electricity' ? 'MWh' : 'm³'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {contract.price.toLocaleString('de-DE')} €/{contract.type === 'electricity' ? 'MWh' : 'm³'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {contract.fixedShare}% Fix
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      {contract.variableShare}% Variabel
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnergyContracts;