// src/app/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import usePatients from '../hooks/usePatient';
import PatientCard from '@/components/PatientCard';
import StatsCards from '@/components/StatsCard';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import PatientForm from '@/components/PatientForm';
import NotesModal from '@/components/NotesModal';
import MedicineAssignmentForm from '@/components/MedicineAssignmentForm';
import MedicineForm from '@/components/MedicineForm';
import LocalStorageService from '@/services/LocalStorageService';
import { Patient, Medicine } from '../types';

const PatientManagementApp: React.FC = () => {
  const {
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    assignMedicine,
    removeMedicineAssignment,
    updateHandwrittenNotes
  } = usePatients();

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load medicines from localStorage on component mount (client-side only)
  useEffect(() => {
    if (!isClient) return;

    if (LocalStorageService.isLocalStorageAvailable()) {
      const savedMedicines = LocalStorageService.getMedicines();
      setMedicines(savedMedicines);
    } else {
      // Fallback to default medicines if localStorage is not available
      setMedicines([
        { id: 1, name: 'Paracetamol', defaultDosage: '500mg' },
        { id: 2, name: 'Aspirin', defaultDosage: '75mg' },
        { id: 3, name: 'Ibuprofen', defaultDosage: '400mg' },
        { id: 4, name: 'Amoxicillin', defaultDosage: '250mg' },
        { id: 5, name: 'Metformin', defaultDosage: '500mg' },
        { id: 6, name: 'Lisinopril', defaultDosage: '10mg' },
        { id: 7, name: 'Atorvastatin', defaultDosage: '20mg' },
        { id: 8, name: 'Omeprazole', defaultDosage: '20mg' }
      ]);
    }
  }, [isClient]);

  // Sync medicines to localStorage whenever medicines state changes (client-side only)
  useEffect(() => {
    if (!isClient || medicines.length === 0) return;

    if (LocalStorageService.isLocalStorageAvailable()) {
      LocalStorageService.saveMedicines(medicines);
    }
  }, [medicines, isClient]);

  // Modal states
  const [showAddPatient, setShowAddPatient] = useState<boolean>(false);
  const [showAddMedicine, setShowAddMedicine] = useState<boolean>(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
  const [selectedPatientForNotes, setSelectedPatientForNotes] = useState<Patient | null>(null);

  // Medicine handlers
  const addMedicine = (medicine: Medicine): void => {
    setMedicines(prev => {
      const updatedMedicines = [...prev, medicine];
      // Save to localStorage immediately
      if (LocalStorageService.isLocalStorageAvailable()) {
        LocalStorageService.saveMedicines(updatedMedicines);
      }
      return updatedMedicines;
    });
    setShowAddMedicine(false);
  };

  const deleteMedicine = (medicineId: number): void => {
    if (window.confirm('Are you sure you want to delete this medicine? It will be removed from all patient prescriptions.')) {
      setMedicines(prev => {
        const updatedMedicines = prev.filter(m => m.id !== medicineId);
        // Save to localStorage immediately
        if (LocalStorageService.isLocalStorageAvailable()) {
          LocalStorageService.saveMedicines(updatedMedicines);
        }
        return updatedMedicines;
      });
    }
  };

  const handleAssignMedicine = (
    patientId: number, 
    medicineId: number, 
    dosage: string, 
    timing: string
  ): void => {
    assignMedicine(patientId, medicineId, medicines, dosage, timing);
  };

  // Modal handlers
  const handleEditPatient = (patient: Patient): void => {
    setEditingPatient(patient);
  };

  const handleAssignMedicineModal = (patient: Patient): void => {
    setSelectedPatient(patient);
  };

  const handleViewNotes = (patient: Patient): void => {
    setSelectedPatientForNotes(patient);
    setShowNotesModal(true);
  };

  const handleCloseNotesModal = (): void => {
    setShowNotesModal(false);
    setSelectedPatientForNotes(null);
  };

  const handleAddPatient = (patient: Patient): void => {
    addPatient(patient);
    setShowAddPatient(false);
  };

  const handleUpdatePatient = (patient: Patient): void => {
    updatePatient(patient);
    setEditingPatient(null);
  };

  const handleDeletePatient = (patientId: number): void => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      deletePatient(patientId);
    }
  };

  const handleUpdateHandwrittenNotes = (patientId: number, notesData: string): void => {
    updateHandwrittenNotes(patientId, notesData);
  };

  // Data management functions
  const handleExportData = (): void => {
    try {
      const data = LocalStorageService.exportData();
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `medic-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error exporting data: ' + error);
    }
  };

  const handleClearAllData = (): void => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      LocalStorageService.clearAllData();
      window.location.reload(); // Refresh to reset all state
    }
  };

  // Calculate stats for handwritten notes
  const patientsWithNotes = patients.filter(p => p.handwrittenNotes).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        onAddPatient={() => setShowAddPatient(true)}
        onAddMedicine={() => setShowAddMedicine(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Data Management Section */}
        {isClient && LocalStorageService.isLocalStorageAvailable() && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Data Management</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportData}
                className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
              >
                Export Data
              </button>
              <button
                onClick={handleClearAllData}
                className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200"
              >
                Clear All Data
              </button>
              <div className="text-xs text-gray-500 self-center">
                Data is automatically saved to your browser • {patientsWithNotes} patients have handwritten notes
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <StatsCards patients={patients} medicines={medicines} />

        {/* Patient List */}
        {patients.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onEdit={handleEditPatient}
                onDelete={handleDeletePatient}
                onAssignMedicine={handleAssignMedicineModal}
                onRemoveMedicine={removeMedicineAssignment}
                onViewNotes={handleViewNotes}
              />
            ))}
          </div>
        ) : (
          <EmptyState onAddPatient={() => setShowAddPatient(true)} />
        )}
      </div>

      {/* Modals */}
      {showAddPatient && (
        <PatientForm
          onSave={handleAddPatient}
          onCancel={() => setShowAddPatient(false)}
        />
      )}

      {editingPatient && (
        <PatientForm
          patient={editingPatient}
          isEdit={true}
          onSave={handleUpdatePatient}
          onCancel={() => setEditingPatient(null)}
        />
      )}

      {selectedPatient && (
        <MedicineAssignmentForm
          patient={selectedPatient}
          medicines={medicines}
          onAssign={handleAssignMedicine}
          onClose={() => setSelectedPatient(null)}
        />
      )}

      {showNotesModal && selectedPatientForNotes && (
        <NotesModal
          patient={selectedPatientForNotes}
          onClose={handleCloseNotesModal}
          onUpdateHandwrittenNotes={handleUpdateHandwrittenNotes}
        />
      )}

      {showAddMedicine && (
        <MedicineForm
          onSave={addMedicine}
          onCancel={() => setShowAddMedicine(false)}
        />
      )}
    </div>
  );
};

export default PatientManagementApp;