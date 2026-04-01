import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
  },
  notes: {
    type: String,
  },
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Session', sessionSchema);