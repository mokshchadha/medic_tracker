// types/index.ts

export interface Medicine {
  id: number;
  name: string;
  defaultDosage: string;
}

export interface MedicineAssignment {
  id: number;
  medicineId: number;
  medicineName: string;
  dosage: string;
  timing: string;
  assignedDate: string;
}

export interface Note {
  id: number | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: number;
  name: string;
  age: string;
  phone?: string;
  address?: string;
  medicalHistory?: string;
  assignedMedicines: MedicineAssignment[];
  notes: Note[];
  createdAt: string;
}

export interface PatientFormData {
  name: string;
  age: string;
  phone?: string;
  address?: string;
  medicalHistory?: string;
  assignedMedicines: MedicineAssignment[];
  notes: Note[];
}

export interface NewMedicineData {
  name: string;
  defaultDosage: string;
}

// Component Props Types
export interface PatientCardProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: number) => void;
  onAssignMedicine: (patient: Patient) => void;
  onRemoveMedicine: (patientId: number, assignmentId: number) => void;
  onViewNotes: (patient: Patient) => void;
}

export interface PatientFormProps {
  patient?: Patient;
  onSave: (patient: Patient | PatientFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export interface MedicineFormProps {
  onSave: (medicine: Medicine) => void;
  onCancel: () => void;
}

export interface MedicineAssignmentFormProps {
  patient: Patient;
  medicines: Medicine[];
  onAssign: (patientId: number, medicineId: number, dosage: string, timing: string) => void;
  onClose: () => void;
}

export interface NotesModalProps {
  patient: Patient;
  onClose: () => void;
  onAddNote: (patientId: number, content: string) => void;
  onUpdateNote: (patientId: number, noteId: number, content: string) => void;
  onDeleteNote: (patientId: number, noteId: number) => void;
}

export interface HeaderProps {
  onAddPatient: () => void;
  onAddMedicine: () => void;
}

export interface EmptyStateProps {
  onAddPatient: () => void;
}

export interface StatsCardsProps {
  patients: Patient[];
  medicines: Medicine[];
}

// Hook return types
export interface UsePatientReturn {
  patients: Patient[];
  addPatient: (patient: PatientFormData) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (patientId: number) => void;
  assignMedicine: (patientId: number, medicineId: number, medicines: Medicine[], dosage: string, timing: string) => void;
  removeMedicineAssignment: (patientId: number, assignmentId: number) => void;
  addNote: (patientId: number, content: string) => void;
  updateNote: (patientId: number, noteId: number, content: string) => void;
  deleteNote: (patientId: number, noteId: number) => void;
}