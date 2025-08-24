// components/EmptyState.tsx
import React from 'react';
import { User } from 'lucide-react';

import { EmptyStateProps } from '../types';

const EmptyState: React.FC<EmptyStateProps> = ({ onAddPatient }) => {
  return (
    <div className="text-center py-12">
      <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No patients yet</h3>
      <p className="text-gray-500 mb-4">Get started by adding your first patient</p>
      <button
        onClick={onAddPatient}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Add Patient
      </button>
    </div>
  );
};

export default EmptyState