import express from 'express';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  const name = req.session.userName || '';
  const email = req.session.userEmail || '';

  res.render('pages/dashboard', { name, email });
  console.log("Session:", req.session);
});

router.get('/apply/:id', ensureAuthenticated, (req, res) => {
  const jobId = req.params.id;
  res.render('pages/apply', { jobId });
});

export default router