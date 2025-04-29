import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { SubmissionStatus } from '../types';

interface StatusIndicatorProps {
  status: SubmissionStatus;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, className = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'submitted':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          label: 'Vollständig'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          label: 'Ausstehend'
        };
      case 'none':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          label: 'Keine Daten'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          label: 'Unbekannt'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`flex items-center space-x-2 px-3 py-1.5 ${config.bgColor} rounded-full ${className}`}>
      <Icon className={`w-4 h-4 ${config.color}`} />
      <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
    </div>
  );
};

export default StatusIndicator;