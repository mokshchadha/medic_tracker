// hooks/usePatients.ts
import { useState } from 'react';
import { Patient, PatientFormData, Medicine, UsePatientReturn, MedicineAssignment, Note } from '../types';

const usePatients = (): UsePatientReturn => {
  const [patients, setPatients] = useState<Patient[]>([]);

  const addPatient = (patientData: PatientFormData): void => {
    const newPatient: Patient = {
      id: Date.now(),
      ...patientData,
      createdAt: new Date().toLocaleDateString()
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const updatePatient = (updatedPatient: Patient): void => {
    setPatients(prev => prev.map(p => 
      p.id === updatedPatient.id ? updatedPatient : p
    ));
  };

  const deletePatient = (patientId: number): void => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
  };

  const assignMedicine = (
    patientId: number, 
    medicineId: number, 
    medicines: Medicine[], 
    dosage: string, 
    timing: string
  ): void => {
    const medicine = medicines.find(m => m.id === medicineId);
    if (!medicine) return;

    const newAssignment: MedicineAssignment = {
      id: Date.now(),
      medicineId,
      medicineName: medicine.name,
      dosage: dosage || medicine.defaultDosage,
      timing,
      assignedDate: new Date().toLocaleDateString()
    };

    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          assignedMedicines: [...p.assignedMedicines, newAssignment]
        };
      }
      return p;
    }));
  };

  const removeMedicineAssignment = (patientId: number, assignmentId: number): void => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          assignedMedicines: p.assignedMedicines.filter(m => m.id !== assignmentId)
        };
      }
      return p;
    }));
  };

  const addNote = (patientId: number, noteContent: string): void => {
    const newNote: Note = {
      id: Date.now(),
      content: noteContent,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString()
    };

    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          notes: [...(p.notes || []), newNote]
        };
      }
      return p;
    }));
  };

  const updateNote = (patientId: number, noteId: number, noteContent: string): void => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          notes: p.notes.map(note => 
            note.id === noteId 
              ? { ...note, content: noteContent, updatedAt: new Date().toLocaleString() }
              : note
          )
        };
      }
      return p;
    }));
  };

  const deleteNote = (patientId: number, noteId: number): void => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          notes: p.notes.filter(note => note.id !== noteId)
        };
      }
      return p;
    }));
  };

  return {
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    assignMedicine,
    removeMedicineAssignment,
    addNote,
    updateNote,
    deleteNote
  };
};

export default usePatients;