import express from 'express';
import {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  logout
} from '../controllers/authController.js';
import { ensureAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/register', getRegister);
router.post('/register', postRegister);
router.get('/logout', logout);

router.get('/admin/jobs/new', ensureAdmin, (req, res) => {
  res.render('pages/newJob');
});

export default router;