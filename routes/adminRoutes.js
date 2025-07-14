import express from 'express';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { ensureAdmin } from '../middlewares/authMiddleware.js';
import ContactMessage from '../models/ContactMessage.js';

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

router.get('/admin/messages', ensureAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ submittedAt: -1 });
    res.render('pages/contactMessages', { messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).send('Error loading messages');
  }
});

router.post('/admin/messages/:id/delete', ensureAdmin, async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    req.session.successMsg = 'Message deleted successfully.';
    res.redirect('/admin/messages');
  } catch (err) {
    console.error('Error deleting message:', err);
    req.session.errorMsg = 'Failed to delete message.';
    res.redirect('/admin/messages');
  }
});


router.get('/admin/user/:userId/history', ensureAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const applications = await Application.find({ userId: user._id }).populate('jobId');

    res.render('pages/userHistory', { user, applications });
  } catch (err) {
    console.error('Error loading user application history:', err);
    res.status(500).send('Server error while loading history');
  }
});

export default router;
