import mongoose from 'mongoose';
import Application from './Application.js';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  discipline: String,
  location: String,
  qualifications: String,
  vacancies: Number,
  deadline: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

jobSchema.pre('findOneAndDelete', async function (next) {
  const jobId = this.getQuery()._id;
  console.log('⏳ Deleting job and related applications:', jobId);
  await Application.deleteMany({ jobId });
  console.log('✅ Related applications deleted.');
  next();
});

export default mongoose.model('Job', jobSchema);
