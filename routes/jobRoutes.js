import express from 'express';
import Job from '../models/Job.js';

const router = express.Router();

router.get('/jobs', async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.render('pages/jobs', { jobs });
});

export default router;
