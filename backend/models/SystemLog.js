import mongoose from 'mongoose';

const systemLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

systemLogSchema.index({ action: 1 });
systemLogSchema.index({ userId: 1 });
systemLogSchema.index({ createdAt: -1 });

export default mongoose.model('SystemLog', systemLogSchema);
