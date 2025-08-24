// components/NotesModal.tsx
import React, { useState } from 'react';
import { FileText, X, Edit2, Trash2 } from 'lucide-react';

import { NotesModalProps, Note } from '../types';

const NotesModal: React.FC<NotesModalProps> = ({ 
  patient, 
  onClose, 
  onAddNote, 
  onUpdateNote, 
  onDeleteNote 
}) => {
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      onAddNote(patient.id, newNoteContent.trim());
      setNewNoteContent('');
    }
  };

  const handleUpdateNote = (noteId : number) => {
    if (editingContent.trim()) {
      onUpdateNote(patient.id, noteId, editingContent.trim());
      setEditingNoteId(null);
      setEditingContent('');
    }
  };

 const startEditing = (note: Note): void => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Notes for {patient.name}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Add new note */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Add New Note</h4>
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md resize-none text-black placeholder-gray-500"
            rows={3}
            placeholder="Write your note here..."
          />
          <button
            onClick={handleAddNote}
            disabled={!newNoteContent.trim()}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm"
          >
            Add Note
          </button>
        </div>
        
        {/* Notes list */}
        <div className="flex-1 overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Previous Notes ({patient.notes?.length || 0})
          </h4>
          
          {patient.notes && patient.notes.length > 0 ? (
            <div className="space-y-3">
              {patient.notes.map((note) => (
                <div key={note.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-gray-500">
                      Created: {note.createdAt}
                      {note.updatedAt !== note.createdAt && (
                        <span className="ml-2">• Updated: {note.updatedAt}</span>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => startEditing(note)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteNote(patient.id, note.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {editingNoteId === note.id ? (
                    <div>
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md resize-none mb-2 text-black placeholder-gray-500"
                        rows="3"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateNote(note.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-800 whitespace-pre-wrap">
                      {note.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic text-center py-8">
              No notes added yet. Add your first note above.
            </p>
          )}
        </div>
        
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

export default NotesModal