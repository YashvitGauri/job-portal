import express from 'express';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  const name = req.session.userName;
  const email = req.session.userEmail;

  const applications = await Application.find({ userId: req.session.userId }).populate('jobId');

  res.render('pages/dashboard', {
    name,
    email,
    applications
  });
});

router.get('/apply/:id', ensureAuthenticated, async (req, res) => {
  const job = await Job.findById(req.params.id);
  res.render('pages/apply', { job });
});

router.post('/apply/:id', ensureAuthenticated, upload.single('resume'), async (req, res) => {
  try {
    const newApp = new Application({
      jobId: req.params.id,
      userId: req.session.userId,
      resumePath: req.file.path
    });

    await newApp.save();
    res.redirect('/dashboard'); // Or a success page
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error submitting application');
  }
});

router.post('/withdraw/:id', ensureAuthenticated, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    // Only allow if it's the logged-in user's application & status is "In-Process"
    if (app.userId.toString() !== req.session.userId || app.status !== 'In-Process') {
      return res.status(403).send('You cannot withdraw this application.');
    }

    await Application.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error withdrawing application:', err);
    res.status(500).send('Server error');
  }
});

export default router