const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  searchStudents,
} = require('../controllers/studentController');

const router = express.Router();

// Multer setup for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes
router.post('/', upload.single('photo'), createStudent);
router.get('/', getAllStudents);
router.get('/search', searchStudents);
router.get('/:id', getStudentById);
router.put('/:id', upload.single('photo'), updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;
