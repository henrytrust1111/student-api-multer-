const Student = require('../models/Student');
const path = require('path');
const fs = require('fs');

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { name, age, grade, email } = req.body;
    let photo = null;

    // Save photo if provided
    if (req.file) {
      photo = req.file.path; // Local file path
    }

    const newStudent = await Student.create({ name, age, grade, email, photo });
    res.status(201).json({ success: true, data: newStudent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a student
exports.updateStudent = async (req, res) => {
  try {
    const updates = req.body;
    const student = await Student.findById(req.params.id);

    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // Update photo if provided
    if (req.file) {
      // Delete old photo if it exists
      if (student.photo && fs.existsSync(student.photo)) {
        fs.unlinkSync(student.photo);
      }
      updates.photo = req.file.path;
    }

    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ success: true, data: updatedStudent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // Delete photo if it exists
    if (student.photo && fs.existsSync(student.photo)) {
      fs.unlinkSync(student.photo);
    }

    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search students
exports.searchStudents = async (req, res) => {
  try {
    const { name, age, grade, email } = req.query;
    const query = {};

    if (name) query.name = { $regex: name, $options: 'i' };
    if (age) query.age = age;
    if (grade) query.grade = { $regex: grade, $options: 'i' };
    if (email) query.email = { $regex: email, $options: 'i' };

    const students = await Student.find(query);
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
