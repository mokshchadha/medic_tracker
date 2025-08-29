// src/models/Patient.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IMedicineAssignment {
  id: number;
  medicineId: number;
  medicineName: string;
  dosage: string;
  timing: string;
  assignedDate: string;
}

export interface IPatient extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  age: string;
  sex: 'male' | 'female' | 'other' | '';
  dateOfAdmission: string;
  diagnosis: string;
  targetSymptoms: string;
  currentTreatment: string;
  additionalTreatment: string;
  phone?: string;
  address?: string;
  handwrittenNotes?: string;
  assignedMedicines: IMedicineAssignment[];
  createdAt: Date;
}

const MedicineAssignmentSchema = new Schema({
  id: { type: Number, required: true },
  medicineId: { type: Number, required: true },
  medicineName: { type: String, required: true },
  dosage: { type: String, required: true },
  timing: { type: String, required: true },
  assignedDate: { type: String, required: true }
});

const PatientSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  age: {
    type: String,
    required: [true, 'Age is required']
  },
  sex: {
    type: String,
    enum: ['male', 'female', 'other', ''],
    required: true
  },
  dateOfAdmission: {
    type: String,
    required: [true, 'Date of admission is required']
  },
  diagnosis: {
    type: String,
    required: [true, 'Diagnosis is required']
  },
  targetSymptoms: String,
  currentTreatment: String,
  additionalTreatment: String,
  phone: String,
  address: String,
  handwrittenNotes: String,
  assignedMedicines: [MedicineAssignmentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);