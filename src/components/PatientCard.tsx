// components/PatientCard.tsx
import React from 'react';
import { Calendar, Phone, MapPin, Edit2, Trash2, FileText, Clock, X, User, Stethoscope, Target, Activity, Plus } from 'lucide-react';
import { PatientCardProps } from '../types';

const PatientCard: React.FC<PatientCardProps> = ({ 
  patient, 
  onEdit, 
  onDelete, 
  onAssignMedicine, 
  onRemoveMedicine, 
  onViewNotes 
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getSexIcon = (sex: string) => {
    switch (sex?.toLowerCase()) {
      case 'male':
        return '♂️';
      case 'female':
        return '♀️';
      default:
        return '👤';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{patient.name}</h3>
            <div className="flex items-center text-sm text-gray-600 space-x-3">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {patient.age} years
              </span>
              <span className="flex items-center">
                {getSexIcon(patient.sex)} {patient.sex || 'Not specified'}
              </span>
            </div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => onViewNotes(patient)}
              className="text-green-600 hover:text-green-800 p-1 rounded"
              title="View Handwritten Notes"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(patient)}
              className="text-blue-600 hover:text-blue-800 p-1 rounded"
              title="Edit Patient"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(patient.id)}
              className="text-red-600 hover:text-red-800 p-1 rounded"
              title="Delete Patient"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Contact Information */}
        <div className="mb-4 space-y-2">
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Contact Information</div>
          {patient.phone && (
            <p className="text-sm text-gray-600 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              {patient.phone}
            </p>
          )}
          {patient.address && (
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              {patient.address}
            </p>
          )}
          {!patient.phone && !patient.address && (
            <p className="text-xs text-gray-400 italic">No contact information provided</p>
          )}
        </div>

        {/* Medical Information */}
        <div className="mb-4 space-y-3">
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Medical Information</div>
          
          <div>
            <div className="flex items-center text-xs text-gray-600 mb-1">
              <Calendar className="w-3 h-3 mr-1" />
              <span className="font-medium">Admission Date:</span>
            </div>
            <p className="text-sm text-gray-800 ml-4">{formatDate(patient.dateOfAdmission)}</p>
          </div>

          <div>
            <div className="flex items-center text-xs text-gray-600 mb-1">
              <Stethoscope className="w-3 h-3 mr-1" />
              <span className="font-medium">Diagnosis:</span>
            </div>
            <p className="text-sm text-gray-800 ml-4 bg-red-50 p-2 rounded border-l-3 border-red-400">
              {patient.diagnosis || 'Not specified'}
            </p>
          </div>

          {patient.targetSymptoms && (
            <div>
              <div className="flex items-center text-xs text-gray-600 mb-1">
                <Target className="w-3 h-3 mr-1" />
                <span className="font-medium">Target Symptoms:</span>
              </div>
              <p className="text-sm text-gray-800 ml-4 bg-yellow-50 p-2 rounded border-l-3 border-yellow-400">
                {patient.targetSymptoms}
              </p>
            </div>
          )}

          {patient.currentTreatment && (
            <div>
              <div className="flex items-center text-xs text-gray-600 mb-1">
                <Activity className="w-3 h-3 mr-1" />
                <span className="font-medium">Current Treatment:</span>
              </div>
              <p className="text-sm text-gray-800 ml-4 bg-blue-50 p-2 rounded border-l-3 border-blue-400 max-h-20 overflow-y-auto">
                {patient.currentTreatment}
              </p>
            </div>
          )}

          {patient.additionalTreatment && (
            <div>
              <div className="flex items-center text-xs text-gray-600 mb-1">
                <Plus className="w-3 h-3 mr-1" />
                <span className="font-medium">Additional Treatment:</span>
              </div>
              <p className="text-sm text-gray-800 ml-4 bg-green-50 p-2 rounded border-l-3 border-green-400 max-h-20 overflow-y-auto">
                {patient.additionalTreatment}
              </p>
            </div>
          )}
        </div>

        {/* Handwritten Notes Preview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Handwritten Notes</div>
            <button
              onClick={() => onViewNotes(patient)}
              className="text-xs text-green-600 hover:text-green-800 font-medium"
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
            <p className="text-xs text-gray-400 italic bg-gray-50 p-2 rounded">No handwritten notes added</p>
          )}
        </div>

        {/* Assigned Medicines */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Assigned Medicines</div>
            <button
              onClick={() => onAssignMedicine(patient)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              + Assign Medicine
            </button>
          </div>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {patient.assignedMedicines.length > 0 ? (
              patient.assignedMedicines.map((med) => (
                <div key={med.id} className="bg-gray-50 p-2 rounded text-xs border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{med.medicineName}</div>
                      <div className="text-gray-600">{med.dosage}</div>
                      <div className="text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {med.timing}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveMedicine(patient.id, med.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      title="Remove medicine"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic bg-gray-50 p-2 rounded">No medicines assigned</p>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-xs text-gray-400 pt-2 border-t">
          Patient added: {patient.createdAt}
        </div>
      </div>
    </div>
  );
};

export default PatientCard;