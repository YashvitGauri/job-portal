
# Job Portal

A modern, secure job application portal built using Node.js, Express, MongoDB, and EJS, designed for DRDO's recruitment system. It supports applicants, recruiters, and full administrative workflows.

---

## Features

###  For Applicants:
- Register, login, and apply for jobs
- Upload resume (PDF)
- View submitted applications and current statuses
- Withdraw applications before review

### For Admin:
- Create, update, and delete job postings
- View all applicants per job
- Update application status (In-Process, Accepted, Rejected)
- View full history of applications per applicant

### UI/UX:
- Fully responsive Bootstrap 5 UI
- Animated homepage sections, testimonial carousel, counters
- Session-aware navigation and alerts
- Social links and contact form support

---

##  Folder Structure

jrf/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── views/
│   ├── pages/
│   └── partials/
├── uploads/
├── public/
│   └── css/
│   └── images/
├── .env
├── server.js

---

## Technologies Used

- Backend: Node.js + Express.js
- Templating: EJS
- Database: MongoDB (with Mongoose)
- Styling: Bootstrap 5, Custom CSS
- File Uploads: `multer`
- Session Management: `express-session`
- Validation: Mongoose Schema

---

## Security

- Role-based access control (`user`, `admin`)
- Session handling & flash messages

---

## 🛠 Setup Instructions

1. Clone this repo:
   ```bash
   git clone https://github.com/YashvitGauri/job-portal
   cd job-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add your `.env` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_secret_key
   ```

4. Run the app:
   ```bash
   npm start
   ```

5. Open in browser:
   ```
   http://localhost:3000
   ```

---

## 📌 Notes

- Admin role must be manually set via MongoDB Compass
- File uploads are stored in `/uploads`

---

## Author

**Yashvit Gauri**  
B.Tech Information Technology  
Project for Summer Training @ DRDO

---


## License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for full terms.

