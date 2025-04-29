import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileType, Loader2, AlertCircle } from 'lucide-react';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesSelected,
  isProcessing,
  acceptedFileTypes = ['.pdf', '.xlsx', '.xls', '.csv'],
  maxFileSize = 10485760 // 10MB
}) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles[0].errors.map((err: any) => {
          switch (err.code) {
            case 'file-too-large':
              return 'Datei ist zu groß (max. 10MB)';
            case 'file-invalid-type':
              return 'Dateityp wird nicht unterstützt';
            default:
              return 'Ungültige Datei';
          }
        });
        setError(errors[0]);
        return;
      }

      setError(null);
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv']
    },
    maxSize: maxFileSize,
    disabled: isProcessing
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          rounded-xl p-8 transition-all duration-200 border-2 border-dashed
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}
          ${isProcessing ? 'opacity-75 cursor-wait' : 'cursor-pointer hover:border-blue-400'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          {isProcessing ? (
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          ) : (
            <UploadCloud className={`w-12 h-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          )}
          
          <div className="mt-4 text-center">
            <p className="text-xl font-medium text-gray-700">
              {isProcessing ? 'Verarbeite Datei...' : 'Energiebericht hier ablegen'}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              oder klicken zum Durchsuchen
            </p>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4">
            {acceptedFileTypes.map((type) => (
              <div key={type} className="flex items-center justify-center px-4 py-2 bg-gray-50 rounded-lg">
                <FileType className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600">{type.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;