// src/models/Medicine.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicine extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  defaultDosage: string;
  createdAt: Date;
}

const MedicineSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true
  },
  defaultDosage: {
    type: String,
    required: [true, 'Default dosage is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Medicine || mongoose.model<IMedicine>('Medicine', MedicineSchema);