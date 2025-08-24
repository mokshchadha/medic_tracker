// components/MedicineForm.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { MedicineFormProps, Medicine, NewMedicineData } from '../types';

const MedicineForm: React.FC<MedicineFormProps> = ({ onSave, onCancel })  => {
  const [newMedicine, setNewMedicine] = useState<NewMedicineData>({
    name: '',
    defaultDosage: ''
  });

  const handleSubmit = (): void => {
    if (newMedicine.name && newMedicine.defaultDosage) {
      const medicine: Medicine = {
        id: Date.now(),
        ...newMedicine
      };
      onSave(medicine);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Medicine</h3>
          <button onClick={onCancel} className="text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medicine Name
            </label>
            <input
              type="text"
              value={newMedicine.name}
              onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Medicine name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Dosage
            </label>
            <input
              type="text"
              value={newMedicine.defaultDosage}
              onChange={(e) => setNewMedicine({...newMedicine, defaultDosage: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., 500mg"
            />
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Add Medicine
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineForm