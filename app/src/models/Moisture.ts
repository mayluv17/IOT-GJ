import mongoose, { Document, Schema } from 'mongoose';

export interface IMoisture extends Document {
  moisture: number;
  timestamp: Date;
}

const MoistureSchema: Schema = new mongoose.Schema({
  moistureBefore: {
    type: Number,
    required: true,
  },
  moistureAfter: {
    type: Number,
    required: true,
  },
  isIrrigated: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Moisture || mongoose.model<IMoisture>('Moisture', MoistureSchema);
