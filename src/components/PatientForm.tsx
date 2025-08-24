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
      sex: '',
      dateOfAdmission: '',
      diagnosis: '',
      targetSymptoms: '',
      currentTreatment: '',
      additionalTreatment: '',
      phone: '',
      address: '',
      handwrittenNotes: '',
      assignedMedicines: []
    }
  );

  const handleSubmit = () => {
    if (formData.name && formData.age && formData.sex && formData.dateOfAdmission && formData.diagnosis) {
      if (isEdit) {
        // For editing, formData should already be a Patient with id and createdAt
        onSave(formData as Patient);
      } else {
        // For new patients, create the full Patient object
        const newPatient: Patient = {
          id: Date.now(),
          ...formData,
          assignedMedicines: formData.assignedMedicines || [],
          createdAt: new Date().toLocaleDateString()
        };
        onSave(newPatient);
      }
    }
  };

  const handleNotesChange = (imageData: string) => {
    setFormData({...formData, handwrittenNotes: imageData});
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const isFormValid = formData.name && formData.age && formData.sex && formData.dateOfAdmission && formData.diagnosis;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl text-black font-semibold">
            {isEdit ? 'Edit Patient' : 'Add New Patient'}
          </h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Patient Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-800 border-b pb-2">Basic Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter patient name"
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
                className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter age"
                min="0"
                max="150"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sex *
              </label>
              <select
                value={formData.sex}
                onChange={(e) => setFormData({...formData, sex: e.target.value as 'male' | 'female' | 'other' | ''})}
                className="w-full p-3 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Admission *
              </label>
              <input
                type="date"
                value={formData.dateOfAdmission}
                onChange={(e) => setFormData({...formData, dateOfAdmission: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                max={getTodayDate()}
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
                className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Enter address"
              />
            </div>
          </div>

          {/* Middle Column - Medical Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-800 border-b pb-2">Medical Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnosis *
              </label>
              <textarea
                value={formData.diagnosis}
                onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Enter primary diagnosis"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Symptoms
              </label>
              <textarea
                value={formData.targetSymptoms}
                onChange={(e) => setFormData({...formData, targetSymptoms: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="List symptoms to monitor and treat"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Treatment
              </label>
              <textarea
                value={formData.currentTreatment}
                onChange={(e) => setFormData({...formData, currentTreatment: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Describe current treatment plan"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Treatment
              </label>
              <textarea
                value={formData.additionalTreatment}
                onChange={(e) => setFormData({...formData, additionalTreatment: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Any additional treatments, procedures, or recommendations"
              />
            </div>
          </div>

          {/* Right Column - Handwritten Notes */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-800 border-b pb-2">Handwritten Notes</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Handwritten)
              </label>
              <HandwrittenNotesCanvas
                value={formData.handwrittenNotes}
                onChange={handleNotesChange}
                width={400}
                height={500}
              />
              <p className="text-xs text-gray-500 mt-2">
                Use this space for handwritten notes, diagrams, or sketches
              </p>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex space-x-3 mt-8 pt-6 border-t">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isEdit ? 'Update Patient' : 'Add Patient'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-400 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
        
        {/* Required fields notice */}
        <p className="text-xs text-gray-500 mt-3 text-center">
          * Required fields: Patient Name, Age, Sex, Date of Admission, and Diagnosis
        </p>
      </div>
    </div>
  );
};

export default PatientForm;