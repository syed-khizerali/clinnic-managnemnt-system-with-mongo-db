import mongoose from 'mongoose';

const aiUsageLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: ['diagnosis_assist', 'prescription_explanation'],
      required: true,
    },
    success: {
      type: Boolean,
      default: true,
    },
    fallbackUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

aiUsageLogSchema.index({ userId: 1 });
aiUsageLogSchema.index({ createdAt: -1 });

export default mongoose.model('AiUsageLog', aiUsageLogSchema);
