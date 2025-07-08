import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import Job from './models/Job.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static('uploads'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/job-portal')
  .then(() => console.log("✅ Connected to MongoDB via Compass"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/job-portal' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId || null;
  res.locals.userName = req.session.userName || '';
  res.locals.userEmail = req.session.userEmail || '';
  res.locals.userRole = req.session.role || null;
  next();
})

app.use((req, res, next) => {
  res.locals.successMsg = req.session.successMsg || null;
  res.locals.errorMsg = req.session.errorMsg || null;
  req.session.successMsg = null;
  req.session.errorMsg = null;
  next();
});

app.use(authRoutes);
app.use(userRoutes);
app.use(jobRoutes);
app.use(adminRoutes);




app.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(3);
    res.render('pages/home', { jobs });
  } catch (err) {
    console.error('Error loading homepage jobs:', err);
    res.render('pages/home', { jobs: [] });
  }
});


app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
