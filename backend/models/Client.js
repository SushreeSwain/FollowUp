import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contactInfo: {
    type: String,
  },
  info: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Client', clientSchema);