import multer from 'multer';
import { storage } from '../config/cloudinary.js';


export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF resumes allowed'));
    }
  }
});
