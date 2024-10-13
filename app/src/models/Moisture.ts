import mongoose, { Document, Schema } from 'mongoose';

export interface IMoisture extends Document {
  moisture: number;
  timestamp: Date;
}

const MoistureSchema: Schema = new mongoose.Schema({
  moisture: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Moisture || mongoose.model<IMoisture>('Moisture', MoistureSchema);
