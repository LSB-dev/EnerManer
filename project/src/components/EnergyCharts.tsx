import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { EnergyData } from '../types';
import { format, subMonths } from 'date-fns';
import { de } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EnergyChartsProps {
  energyData: EnergyData;
}

const EnergyCharts: React.FC<EnergyChartsProps> = ({ energyData }) => {
  // Generate last 6 months for x-axis
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return format(date, 'MMM yyyy', { locale: de });
  }).reverse();

  // Mock historical data - in a real app, this would come from the backend
  const mockHistoricalData = {
    electricity: Array.from({ length: 6 }, () => energyData.consumption.electricity.current * (0.8 + Math.random() * 0.4)),
    gas: Array.from({ length: 6 }, () => energyData.consumption.gas.current * (0.8 + Math.random() * 0.4)),
    pv: Array.from({ length: 6 }, () => energyData.generation.pv.generation * (0.8 + Math.random() * 0.4)),
    chp: Array.from({ length: 6 }, () => energyData.generation.chp.generation * (0.8 + Math.random() * 0.4))
  };

  const consumptionData = {
    labels: months,
    datasets: [
      {
        label: 'Stromverbrauch',
        data: mockHistoricalData.electricity,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Gasverbrauch',
        data: mockHistoricalData.gas,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const generationData = {
    labels: months,
    datasets: [
      {
        label: 'PV-Anlage',
        data: mockHistoricalData.pv,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'BHKW',
        data: mockHistoricalData.chp,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Verbrauch/Erzeugung (MWh)'
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Energieverbrauch</h3>
        <div className="h-64">
          <Line data={consumptionData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Energieerzeugung</h3>
        <div className="h-64">
          <Line data={generationData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default EnergyCharts;