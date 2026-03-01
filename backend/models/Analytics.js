import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['daily', 'monthly', 'doctor_performance'], required: true },
    period: { date: Date, month: Number, year: Number },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Analytics', analyticsSchema);
