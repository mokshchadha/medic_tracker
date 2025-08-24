// components/PatientCard.tsx
import React from 'react';
import { Calendar, Phone, MapPin, Edit2, Trash2, StickyNote, Clock, X, FileText } from 'lucide-react';
import { PatientCardProps } from '../types'

const PatientCard: React.FC<PatientCardProps> = ({ 
  patient, 
  onEdit, 
  onDelete, 
  onAssignMedicine, 
  onRemoveMedicine, 
  onViewNotes 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-500 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Age: {patient.age}
            </p>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => onViewNotes(patient)}
              className="text-green-600 hover:text-green-800"
              title="View Handwritten Notes"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(patient)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit Patient"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(patient.id)}
              className="text-red-600 hover:text-red-800"
              title="Delete Patient"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {patient.phone && (
          <p className="text-sm text-gray-600 flex items-center mb-2">
            <Phone className="w-4 h-4 mr-1" />
            {patient.phone}
          </p>
        )}
        
        {patient.address && (
          <p className="text-sm text-gray-600 flex items-center mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            {patient.address}
          </p>
        )}

        {/* Handwritten Notes Preview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Handwritten Notes</h4>
            <button
              onClick={() => onViewNotes(patient)}
              className="text-xs text-green-600 hover:text-green-800"
            >
              {patient.handwrittenNotes ? 'View Notes' : '+ Add Notes'}
            </button>
          </div>
          
          {patient.handwrittenNotes ? (
            <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
              <img 
                src={patient.handwrittenNotes} 
                alt="Handwritten notes preview" 
                className="w-full h-16 object-contain border border-yellow-300 rounded cursor-pointer hover:opacity-80"
                onClick={() => onViewNotes(patient)}
                title="Click to view full notes"
              />
              <p className="text-xs text-yellow-700 mt-1">Click to view full notes</p>
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">No handwritten notes added</p>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Assigned Medicines</h4>
            <button
              onClick={() => onAssignMedicine(patient)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              + Assign
            </button>
          </div>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {patient.assignedMedicines.length > 0 ? (
              patient.assignedMedicines.map((med) => (
                <div key={med.id} className="bg-gray-50 p-2 rounded text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{med.medicineName}</div>
                      <div className="text-gray-600">{med.dosage}</div>
                      <div className="text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {med.timing}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveMedicine(patient.id, med.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic">No medicines assigned</p>
            )}
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          Added: {patient.createdAt}
        </div>
      </div>
    </div>
  );
};

export default PatientCard