import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Clinic name is required'],
      trim: true,
    },
    subscriptionPlan: {
      type: String,
      enum: ['basic', 'pro', 'enterprise'],
      default: 'basic',
    },
    aiEnabled: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Clinic', clinicSchema);
