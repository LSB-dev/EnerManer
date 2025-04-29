import React from 'react';
import { Filter } from 'lucide-react';
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
<h3 className="text-lg font-semibold text-gray-900">Energiereporting</h3>
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
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stromverbrauch (kWh)</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peak (kWh)</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Off-Peak (kWh)</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peak (kW)</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stromlieferant</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gasverbrauch (kWh)</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gaslieferant</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eingereicht am</th>
</tr>
</thead>
<tbody className="bg-white divide-y divide-gray-100">
            {reports.map((report) => (
<tr key={`${report.year}-${report.quarter}`} className="hover:bg-gray-50">
<td className="px-6 py-4 whitespace-nowrap">
<span className="text-sm text-gray-900">{report.consumption.electricity.toLocaleString('de-DE')}</span>
</td>
<td className="px-6 py-4 whitespace-nowrap">
<span className="text-sm text-gray-900">{(report.consumption.electricity * 0.6).toLocaleString('de-DE')}</span>
</td>
<td className="px-6 py-4 whitespace-nowrap">
<span className="text-sm text-gray-900">{(report.consumption.electricity * 0.4).toLocaleString('de-DE')}</span>
</td>
<td className="px-6 py-4 whitespace-nowrap">
<span className="text-sm text-gray-900">{(report.consumption.electricity / 720).toLocaleString('de-DE')}</span>
</td>
<td className="px-6 py-4 whitespace-nowrap">
<span className="text-sm text-gray-900">EnergieStadt AG</span>
</td>
<td className="px-6 py-4 whitespace-nowrap">
<span className="text-sm text-gray-900">{report.consumption.gas.toLocaleString('de-DE')}</span>
</td>
<td className="px-6 py-4 whitespace-nowrap">
<span className="text-sm text-gray-900">{report.gasSupplier}</span>
</td>
<td className="px-6 py-4 whitespace-nowrap">
<span className="text-sm text-gray-600">
                    {format(report.submissionDate, 'dd.MM.yyyy HH:mm', { locale: de })}
</span>
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