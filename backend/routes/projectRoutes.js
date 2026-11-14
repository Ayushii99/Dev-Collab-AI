const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// Sabhi project routes private honge, isliye 'protect' middleware lagaya hai
router.route('/').post(protect, createProject).get(protect, getProjects);

module.exports = router;