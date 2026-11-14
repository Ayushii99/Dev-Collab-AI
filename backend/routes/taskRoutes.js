const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasksByProject,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Routes for specific project tasks
router.route('/:projectId').post(protect, createTask).get(protect, getTasksByProject);

module.exports = router;