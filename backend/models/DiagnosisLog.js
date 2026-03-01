import mongoose from 'mongoose';

const diagnosisLogSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symptoms: { type: String, required: true, trim: true },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    history: { type: String, trim: true },
    aiResponse: { type: mongoose.Schema.Types.Mixed },
    riskLevel: { type: String, enum: ['low', 'medium', 'high'] },
  },
  { timestamps: true }
);

export default mongoose.model('DiagnosisLog', diagnosisLogSchema);
