import React from 'react';
import { Download, Filter } from 'lucide-react';
import { QuarterlyReport } from '../types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface QuarterlyReportGridProps {
  reports: QuarterlyReport[];
  onExport: (report: QuarterlyReport) => void;
}

const QuarterlyReportGrid: React.FC<QuarterlyReportGridProps> = ({ reports, onExport }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Quartalsberichte</h3>
          <button className="flex items-center space-x-2 px-3 py-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quartal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zeitraum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stromverbrauch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gasverbrauch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PV-Erzeugung</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BHKW-Erzeugung</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eingereicht am</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aktion</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {reports.map((report) => (
              <tr key={`${report.year}-${report.quarter}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">Q{report.quarter}/{report.year}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {format(report.startDate, 'dd.MM.', { locale: de })} - {format(report.endDate, 'dd.MM.yyyy', { locale: de })}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{report.consumption.electricity} MWh</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{report.consumption.gas} MWh</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{report.generation.pv} kWh</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{report.generation.chp} kWh</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {format(report.submissionDate, 'dd.MM.yyyy HH:mm', { locale: de })}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => onExport(report)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuarterlyReportGrid;