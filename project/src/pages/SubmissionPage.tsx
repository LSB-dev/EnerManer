import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DataSubmissionForm from '../components/DataSubmissionForm';

const SubmissionPage: React.FC = () => {
  const { plantId, token } = useParams();

  // In a real application, you would validate the token here
  const isValidToken = true; // Placeholder for token validation
  const plantName = "Werk001"; // Placeholder for plant name lookup

  const handleSubmit = (data: { electricity: number; gas: number }) => {
    // In a real application, you would submit this data to your backend
    console.log('Submitted data:', data);
    // Show success message and redirect
    alert('Daten erfolgreich übermittelt');
  };

  if (!isValidToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <DataSubmissionForm
        plantId={plantId!}
        plantName={plantName}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default SubmissionPage;