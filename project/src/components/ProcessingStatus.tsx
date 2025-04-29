import React from 'react';
import { CheckCircle, AlertCircle, FileType } from 'lucide-react';
import { ProcessedFile, FileStatus } from '../types';

interface ProcessingStatusProps {
  file: ProcessedFile;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ file }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeColor = (type: string) => {
    if (type.includes('excel') || type.includes('spreadsheet')) return 'text-blue-500';
    if (type.includes('csv')) return 'text-green-500';
    if (type.includes('email') || type.includes('message')) return 'text-purple-500';
    return 'text-gray-500';
  };

  return (
    <div className="status-card-hover bg-white rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${
          file.status === FileStatus.SUCCESS ? 'bg-green-50' : 'bg-red-50'
        }`}>
          {file.status === FileStatus.SUCCESS ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-500" />
          )}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <FileType className={`w-4 h-4 ${getFileTypeColor(file.type)}`} />
            <p className="font-medium text-gray-900">{file.name}</p>
          </div>
          <p className="text-sm text-gray-500">
            {formatFileSize(file.size)} • Verarbeitet um {file.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-medium ${
          file.status === FileStatus.SUCCESS ? 'text-green-600' : 'text-red-600'
        }`}>
          {file.message}
        </p>
      </div>
    </div>
  );
};

export default ProcessingStatus;