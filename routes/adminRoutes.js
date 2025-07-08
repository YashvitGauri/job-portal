import express from 'express';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { ensureAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/admin/dashboard', ensureAdmin, async (req, res) => {
  const applications = await Application.find()
    .populate('userId')
    .populate('jobId')
    .sort({ createdAt: -1 });

  res.render('pages/adminDashboard', { applications });
});

router.post('/admin/application/:id/status', ensureAdmin, async (req, res) => {
  const { status } = req.body;

  try {
    await Application.findByIdAndUpdate(req.params.id, {
      status: status
    });

    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).send('Server error while updating application status.');
  }
});

router.get('/admin/jobs', ensureAdmin, async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.render('pages/adminJobs', { jobs });
});

router.post('/admin/jobs', ensureAdmin, async (req, res) => {
  const { title, discipline, location, qualifications, vacancies, deadline } = req.body;

  try {
    const newJob = new Job({
      title,
      discipline,
      location,
      qualifications,
      vacancies,
      deadline,
      createdBy: req.session.userId
    });

    await newJob.save();
    res.redirect('/admin/jobs');
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).send('Error creating job');
  }
});

router.get('/admin/jobs/:id/edit', ensureAdmin, async (req, res) => {
  const job = await Job.findById(req.params.id);
  res.render('pages/editJob', { job });
});

router.post('/admin/jobs/:id/update', ensureAdmin, async (req, res) => {
  const { title, discipline, location, qualifications, vacancies, deadline } = req.body;

  try {
    await Job.findByIdAndUpdate(req.params.id, {
      title,
      discipline,
      location,
      qualifications,
      vacancies,
      deadline
    });

    res.redirect('/admin/jobs');
  } catch (err) {
    console.error('Error updating job:', err);
    res.status(500).send('Error updating job');
  }
});

router.post('/admin/jobs/:id/delete', ensureAdmin, async (req, res) => {
  try {
    await Job.findOneAndDelete({ _id: req.params.id });
    res.redirect('/admin/jobs');
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).send('Error deleting job');
  }
});

router.get('/admin/jobs/:id/applicants', ensureAdmin, async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await Job.findById(jobId);
    const applications = await Application.find({ jobId })
      .populate('userId')
      .sort({ createdAt: -1 });

    res.render('pages/adminApplicants', { job, applications });
  } catch (err) {
    console.error('Error fetching applicants:', err);
    res.status(500).send('Error loading applicants');
  }
});

export default router;
