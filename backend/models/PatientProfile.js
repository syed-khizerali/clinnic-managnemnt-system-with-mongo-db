import mongoose from 'mongoose';

const patientProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
    },
    age: {
      type: Number,
      min: 0,
      max: 150,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    medicalHistory: [{
      condition: String,
      date: Date,
      notes: String,
    }],
    allergies: [{
      type: String,
      trim: true,
    }],
  },
  { timestamps: true }
);

export default mongoose.model('PatientProfile', patientProfileSchema);
