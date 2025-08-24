// components/StatsCards.tsx
import React from 'react';
import { StatsCardsProps } from '../types';

const StatsCards: React.FC<StatsCardsProps> = ({ patients, medicines }) => {
  const totalPrescriptions = patients.reduce((sum, p) => sum + p.assignedMedicines.length, 0);
  const totalNotes = patients.reduce((sum, p) => sum + (p.notes?.length || 0), 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
        <div className="text-sm text-gray-600">Total Patients</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-green-600">{medicines.length}</div>
        <div className="text-sm text-gray-600">Available Medicines</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-purple-600">{totalPrescriptions}</div>
        <div className="text-sm text-gray-600">Active Prescriptions</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-orange-600">{totalNotes}</div>
        <div className="text-sm text-gray-600">Total Notes</div>
      </div>
    </div>
  );
};

export default StatsCards