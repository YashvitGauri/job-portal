import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumePath: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['In-Process', 'Accepted', 'Rejected'],
    default: 'In-Process'
  }
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);
