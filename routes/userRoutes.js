import express from 'express';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

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
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).send('Job not found');

    res.render('pages/apply', { job, user: req.session });
  } catch (err) {
    console.error('Error loading apply page:', err);
    res.status(500).send('Server error');
  }
});

router.post('/apply/:id', ensureAuthenticated, upload.single('resume'), async (req, res) => {
  try {
    const newApp = new Application({
      jobId: req.params.id,
      userId: req.session.userId,
      resumePath: req.file.path,
      status: 'In-Process',
      statusHistory: [
    { status: 'In-Process', updatedAt: new Date() }
    ]
    });

    await newApp.save();
    res.redirect('/dashboard');
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


router.get('/forgot-password', (req, res) => {
  res.render('pages/forgot-password', { message: null });
});

router.post('/forgot-password', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.render('pages/forgot-password', { message: 'No account found with that email' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetURL = `${process.env.BASE_URL}/reset-password/${token}`;
  const html = `
    <div style="font-family:Arial,sans-serif;padding:20px;background:#f4f4f4">
      <div style="max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:8px;">
        <h2 style="color:#143375;">DRDO Job Portal</h2>
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password. Click below:</p>
        <a href="${resetURL}" style="display:inline-block;padding:10px 20px;background:#143375;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    </div>
  `;
  await sendEmail(user.email, 'Password Reset - DRDO Job Portal', html);

  res.render('pages/forgot-password', { message: 'Check your email for reset link' });
});

router.get('/reset-password/:token', async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) return res.send('Token is invalid or expired');
  res.render('pages/reset-password', { token: req.params.token });
});

router.post('/reset-password/:token', async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) return res.send('Token is invalid or expired');

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.redirect('/login');
});


export default router