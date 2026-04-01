import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Session', sessionSchema);