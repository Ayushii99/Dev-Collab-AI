const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasksByProject,
  getAllTasks, // Agar controller mein hai, ya niche wala controller use karein
} = require('../controllers/taskController');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Routes for specific project tasks
router.route('/:projectId').post(protect, createTask).get(protect, getTasksByProject);

module.exports = router;