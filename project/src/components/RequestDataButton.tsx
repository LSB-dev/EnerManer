import React from 'react';
import { Mail } from 'lucide-react';
import { PlantData } from '../types';

interface RequestDataButtonProps {
  plant: PlantData;
  onRequest: (plant: PlantData) => void;
  disabled?: boolean;
}

const RequestDataButton: React.FC<RequestDataButtonProps> = ({ plant, onRequest, disabled }) => {
  return (
    <button
      onClick={() => onRequest(plant)}
      disabled={disabled}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
        ${disabled 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 transition-colors'}
      `}
    >
      <Mail className="w-4 h-4" />
      <span>Verbrauchsdaten anfordern</span>
    </button>
  );
};

export default RequestDataButton;