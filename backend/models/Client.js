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
  highPriority:{
    type : Boolean,
    default: false,
  },
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Client', clientSchema);