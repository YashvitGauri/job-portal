import express from 'express';
import {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  logout
} from '../controllers/authController.js';
import { ensureAdmin } from '../middlewares/authMiddleware.js';
import ContactMessage from '../models/ContactMessage.js';

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/register', getRegister);
router.post('/register', postRegister);
router.get('/logout', logout);

router.get('/admin/jobs/new', ensureAdmin, (req, res) => {
  res.render('pages/newJob');
});


router.get('/contact', (req, res) => {
  res.render('pages/contact');
});


router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();

    req.session.successMsg = 'Your message has been sent successfully!';
    res.redirect('/contact');
  } catch (err) {
    console.error('Error saving contact message:', err);
    req.session.errorMsg = 'Something went wrong. Please try again.';
    res.redirect('/contact');
  }
});

export default router;