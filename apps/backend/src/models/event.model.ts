import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    userId: String,
    type: String,
    value: Number,
    timestamp: Date,
    metadata: Object,
  },
  { timestamps: true }
);

export default mongoose.model('Event', EventSchema);
