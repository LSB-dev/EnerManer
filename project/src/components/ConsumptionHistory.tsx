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
import { Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ConsumptionHistoryProps {
  plant: string;
}

const ConsumptionHistory: React.FC<ConsumptionHistoryProps> = ({ plant }) => {
  // Demo data - in a real application, this would come from your backend
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun'];
  const electricityData = [1200, 1150, 1300, 1250, 1400, 1350];
  const gasData = [800, 850, 750, 700, 650, 700];

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Stromverbrauch',
        data: electricityData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Gasverbrauch',
        data: gasData,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Historischer Energieverbrauch - ${plant}`,
        font: {
          size: 16,
          weight: '600'
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(0)} MWh`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Verbrauch (MWh)'
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
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Verbrauchsübersicht</h2>
        </div>
      </div>
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ConsumptionHistory;