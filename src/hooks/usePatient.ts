// hooks/usePatient.ts
import { useState, useEffect } from 'react';
import { Patient, PatientFormData, Medicine, UsePatientReturn, MedicineAssignment } from '../types';
import LocalStorageService from '../services/LocalStorageService';

const usePatients = (): UsePatientReturn => {
  const [patients, setPatients] = useState<Patient[]>([]);

  // Load patients from localStorage on component mount
  useEffect(() => {
    if (LocalStorageService.isLocalStorageAvailable()) {
      const savedPatients = LocalStorageService.getPatients();
      setPatients(savedPatients);
    }
  }, []);

  // Sync patients to localStorage whenever patients state changes
  useEffect(() => {
    if (LocalStorageService.isLocalStorageAvailable() && patients.length >= 0) {
      LocalStorageService.savePatients(patients);
    }
  }, [patients]);

  const addPatient = (patientData: PatientFormData): void => {
    const newPatient: Patient = {
      id: Date.now(),
      ...patientData,
      createdAt: new Date().toLocaleDateString()
    };
    
    setPatients(prev => {
      const updatedPatients = [...prev, newPatient];
      // Save to localStorage immediately
      if (LocalStorageService.isLocalStorageAvailable()) {
        LocalStorageService.savePatients(updatedPatients);
      }
      return updatedPatients;
    });
  };

  const updatePatient = (updatedPatient: Patient): void => {
    setPatients(prev => {
      const updatedPatients = prev.map(p => 
        p.id === updatedPatient.id ? updatedPatient : p
      );
      // Save to localStorage immediately
      if (LocalStorageService.isLocalStorageAvailable()) {
        LocalStorageService.savePatients(updatedPatients);
      }
      return updatedPatients;
    });
  };

  const deletePatient = (patientId: number): void => {
    setPatients(prev => {
      const updatedPatients = prev.filter(p => p.id !== patientId);
      // Save to localStorage immediately
      if (LocalStorageService.isLocalStorageAvailable()) {
        LocalStorageService.savePatients(updatedPatients);
      }
      return updatedPatients;
    });
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

    setPatients(prev => {
      const updatedPatients = prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            assignedMedicines: [...p.assignedMedicines, newAssignment]
          };
        }
        return p;
      });
      
      // Save to localStorage immediately
      if (LocalStorageService.isLocalStorageAvailable()) {
        LocalStorageService.savePatients(updatedPatients);
      }
      return updatedPatients;
    });
  };

  const removeMedicineAssignment = (patientId: number, assignmentId: number): void => {
    setPatients(prev => {
      const updatedPatients = prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            assignedMedicines: p.assignedMedicines.filter(m => m.id !== assignmentId)
          };
        }
        return p;
      });
      
      // Save to localStorage immediately
      if (LocalStorageService.isLocalStorageAvailable()) {
        LocalStorageService.savePatients(updatedPatients);
      }
      return updatedPatients;
    });
  };

  const updateHandwrittenNotes = (patientId: number, notesData: string): void => {
    setPatients(prev => {
      const updatedPatients = prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            handwrittenNotes: notesData
          };
        }
        return p;
      });
      
      // Save to localStorage immediately
      if (LocalStorageService.isLocalStorageAvailable()) {
        LocalStorageService.savePatients(updatedPatients);
      }
      return updatedPatients;
    });
  };

  return {
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    assignMedicine,
    removeMedicineAssignment,
    updateHandwrittenNotes
  };
};

export default usePatients;