import React from 'react';
import { Line } from 'react-chartjs-2';
import { PlantData } from '../types';
import { format, subMonths } from 'date-fns';
import { de } from 'date-fns/locale';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AggregatedEnergyChartProps {
  plants: PlantData[];
}

const AggregatedEnergyChart: React.FC<AggregatedEnergyChartProps> = ({ plants }) => {
  // Generate last 12 months for x-axis
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return format(date, 'MMM yyyy', { locale: de });
  }).reverse();

  // Calculate total consumption and generation for each plant
  const totalConsumption = {
    electricity: Array.from({ length: 12 }, () => 0),
    gas: Array.from({ length: 12 }, () => 0)
  };

  const totalGeneration = {
    pv: Array.from({ length: 12 }, () => 0),
    chp: Array.from({ length: 12 }, () => 0)
  };

  // Aggregate data from all plants
  plants.forEach(plant => {
    // Generate mock historical data for each plant
    const mockMonthlyData = {
      electricity: Array.from({ length: 12 }, () => 
        plant.energyData.consumption.electricity.current * (0.8 + Math.random() * 0.4)
      ),
      gas: Array.from({ length: 12 }, () => 
        plant.energyData.consumption.gas.current * (0.8 + Math.random() * 0.4)
      ),
      pv: Array.from({ length: 12 }, () => 
        plant.energyData.generation.pv.generation * (0.8 + Math.random() * 0.4) / 1000 // Convert kWh to MWh
      ),
      chp: Array.from({ length: 12 }, () => 
        plant.energyData.generation.chp.generation * (0.8 + Math.random() * 0.4) / 1000 // Convert kWh to MWh
      )
    };

    // Add to totals
    mockMonthlyData.electricity.forEach((value, index) => {
      totalConsumption.electricity[index] += value;
    });
    mockMonthlyData.gas.forEach((value, index) => {
      totalConsumption.gas[index] += value;
    });
    mockMonthlyData.pv.forEach((value, index) => {
      totalGeneration.pv[index] += value;
    });
    mockMonthlyData.chp.forEach((value, index) => {
      totalGeneration.chp[index] += value;
    });
  });

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Gesamter Stromverbrauch',
        data: totalConsumption.electricity,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y'
      },
      {
        label: 'Gesamter Gasverbrauch',
        data: totalConsumption.gas,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y'
      },
      {
        label: 'PV-Erzeugung',
        data: totalGeneration.pv,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y'
      },
      {
        label: 'BHKW-Erzeugung',
        data: totalGeneration.chp,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y'
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
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2) + ' MWh';
            }
            return label;
          }
        }
      },
      title: {
        display: true,
        text: 'Gesamtenergiebilanz aller Standorte',
        font: {
          size: 16,
          weight: '600'
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'MWh'
        },
        ticks: {
          callback: function(value: any) {
            return value.toFixed(1) + ' MWh';
          }
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
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="h-96">
        <Line data={data} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Durchschnittlicher Gesamtverbrauch</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-semibold text-blue-600">
                {Math.round(totalConsumption.electricity.reduce((a, b) => a + b, 0) / 12)} MWh
              </p>
              <p className="text-sm text-gray-500">Strom pro Monat</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-red-600">
                {Math.round(totalConsumption.gas.reduce((a, b) => a + b, 0) / 12)} MWh
              </p>
              <p className="text-sm text-gray-500">Gas pro Monat</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Durchschnittliche Gesamterzeugung</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-semibold text-amber-600">
                {Math.round(totalGeneration.pv.reduce((a, b) => a + b, 0) / 12)} MWh
              </p>
              <p className="text-sm text-gray-500">PV pro Monat</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-green-600">
                {Math.round(totalGeneration.chp.reduce((a, b) => a + b, 0) / 12)} MWh
              </p>
              <p className="text-sm text-gray-500">BHKW pro Monat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AggregatedEnergyChart;