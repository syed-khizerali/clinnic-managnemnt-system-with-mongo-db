import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  dosage: { type: String, required: true, trim: true },
  frequency: { type: String, trim: true },
  duration: { type: String, trim: true },
  notes: { type: String, trim: true },
});

const prescriptionSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    diagnosis: { type: String, trim: true },
    medicines: [medicineSchema],
    instructions: { type: String, trim: true },
    notes: { type: String, trim: true },
    aiExplanation: { type: String, trim: true },
    aiExplanationUrdu: { type: String, trim: true },
  },
  { timestamps: true }
);

prescriptionSchema.index({ patientId: 1 });
prescriptionSchema.index({ doctorId: 1 });
export default mongoose.model('Prescription', prescriptionSchema);
