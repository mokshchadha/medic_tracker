
// components/MedicineAssignmentForm.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { MedicineAssignmentFormProps } from '../types';

const MedicineAssignmentForm: React.FC<MedicineAssignmentFormProps> = ({ 
  patient, 
  medicines, 
  onAssign, 
  onClose 
}) => {
  const [selectedMedicineId, setSelectedMedicineId] = useState('');
  const [dosage, setDosage] = useState('');
  const [timing, setTiming] = useState('');

  const handleAssign = () => {
    if (selectedMedicineId && timing) {
      onAssign(patient.id, parseInt(selectedMedicineId), dosage, timing);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Assign Medicine</h3>
          <button onClick={onClose} className="text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medicine
            </label>
            <select
              value={selectedMedicineId}
              onChange={(e) => {
                setSelectedMedicineId(e.target.value);
                const medicine = medicines.find(m => m.id === parseInt(e.target.value));
                if (medicine) setDosage(medicine.defaultDosage);
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a medicine</option>
              {medicines.map(medicine => (
                <option key={medicine.id} value={medicine.id}>
                  {medicine.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dosage
            </label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., 500mg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timing
            </label>
            <input
              type="text"
              value={timing}
              onChange={(e) => setTiming(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., Twice daily after meals"
            />
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleAssign}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Assign Medicine
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineAssignmentForm