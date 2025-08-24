// components/NotesModal.tsx
import React, { useState } from 'react';
import { FileText, X, Edit2, Save } from 'lucide-react';
import { NotesModalProps } from '../types';
import HandwrittenNotesCanvas from './HandwrittenNotesCanvas';

const NotesModal: React.FC<NotesModalProps> = ({ 
  patient, 
  onClose, 
  onUpdateHandwrittenNotes
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingNotes, setEditingNotes] = useState(patient.handwrittenNotes || '');

  const handleSaveNotes = () => {
    onUpdateHandwrittenNotes(patient.id, editingNotes);
    setIsEditing(false);
  };

  const handleStartEditing = () => {
    setEditingNotes(patient.handwrittenNotes || '');
    setIsEditing(true);
  };

  const handleNotesChange = (imageData: string) => {
    setEditingNotes(imageData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Handwritten Notes for {patient.name}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {isEditing ? (
          <div className="flex-1 overflow-y-auto">
            <div className="mb-4 flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-700">Edit Handwritten Notes</h4>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveNotes}
                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
            
            <HandwrittenNotesCanvas
              value={editingNotes}
              onChange={handleNotesChange}
              width={600}
              height={400}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="mb-4 flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-700">Current Notes</h4>
              <button
                onClick={handleStartEditing}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit Notes
              </button>
            </div>
            
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              {patient.handwrittenNotes ? (
                <div className="text-center">
                  <img 
                    src={patient.handwrittenNotes} 
                    alt="Handwritten notes" 
                    className="max-w-full h-auto border border-gray-200 rounded"
                    style={{ maxHeight: '400px' }}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Click &ldquo;Edit Notes&ldquo; to modify the handwritten notes
                  </p>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm">No handwritten notes yet</p>
                  <p className="text-xs mt-1">Click &ldquo;Edit Notes&ldquo; to start drawing</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;