'use client'

import React, { useState } from 'react';
import usePatients from '../hooks/usePatient';
import PatientCard from '@/components/PatientCard';
import StatsCards from '@/components/StatsCard';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import PatientForm from '@/components/PatientForm';
import NotesModal from '@/components/NotesModal';
import MedicineAssignmentForm from '@/components/MedicineAssignmentForm';
import MedicineForm from '@/components/MedicineForm';
import { Patient, Medicine, PatientFormData } from '../types';

const PatientManagementApp: React.FC = () => {
  const {
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    assignMedicine,
    removeMedicineAssignment,
    addNote,
    updateNote,
    deleteNote
  } = usePatients();

  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: 1, name: 'Paracetamol', defaultDosage: '500mg' },
    { id: 2, name: 'Aspirin', defaultDosage: '75mg' },
    { id: 3, name: 'Ibuprofen', defaultDosage: '400mg' },
    { id: 4, name: 'Amoxicillin', defaultDosage: '250mg' },
    { id: 5, name: 'Metformin', defaultDosage: '500mg' },
    { id: 6, name: 'Lisinopril', defaultDosage: '10mg' },
    { id: 7, name: 'Atorvastatin', defaultDosage: '20mg' },
    { id: 8, name: 'Omeprazole', defaultDosage: '20mg' }
  ]);

  // Modal states
  const [showAddPatient, setShowAddPatient] = useState<boolean>(false);
  const [showAddMedicine, setShowAddMedicine] = useState<boolean>(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
  const [selectedPatientForNotes, setSelectedPatientForNotes] = useState<Patient | null>(null);

  // Medicine handlers
  const addMedicine = (medicine: Medicine): void => {
    setMedicines(prev => [...prev, medicine]);
    setShowAddMedicine(false);
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

  const handleAddPatient = (patientData: PatientFormData): void => {
    addPatient(patientData);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        onAddPatient={() => setShowAddPatient(true)}
        onAddMedicine={() => setShowAddMedicine(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          onAddNote={addNote}
          onUpdateNote={updateNote}
          onDeleteNote={deleteNote}
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