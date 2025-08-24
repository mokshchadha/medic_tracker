// components/PatientForm.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Patient, PatientFormData, PatientFormProps } from '@/types';
import HandwrittenNotesCanvas from './HandwrittenNotesCanvas';

const PatientForm: React.FC<PatientFormProps> = ({ 
  patient, 
  onSave, 
  onCancel, 
  isEdit = false 
}) => {
  const [formData, setFormData] = useState<Patient | PatientFormData>(
    patient || {
      name: '',
      age: '',
      phone: '',
      address: '',
      handwrittenNotes: '',
      assignedMedicines: []
    }
  );

  const handleSubmit = () => {
    if (formData.name && formData.age) {
      if (isEdit) {
        onSave(formData);
      } else {
        const newPatient = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toLocaleDateString()
        };
        onSave(newPatient);
      }
    }
  };

  const handleNotesChange = (imageData: string) => {
    setFormData({...formData, handwrittenNotes: imageData});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg text-black font-semibold">
            {isEdit ? 'Edit Patient' : 'Add New Patient'}
          </h3>
          <button onClick={onCancel} className="text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-black placeholder-gray-500"
                placeholder="Patient name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-black placeholder-gray-500"
                placeholder="Age"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-black placeholder-gray-500"
                placeholder="Phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-black placeholder-gray-500"
                rows={3}
                placeholder="Address"
              />
            </div>
          </div>

          {/* Right Column - Handwritten Notes */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Handwritten Notes
              </label>
              <HandwrittenNotesCanvas
                value={formData.handwrittenNotes}
                onChange={handleNotesChange}
                width={400}
                height={300}
              />
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6 pt-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.age}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isEdit ? 'Update' : 'Add'} Patient
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

export default PatientForm;