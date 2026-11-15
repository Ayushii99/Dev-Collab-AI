const express = require('express');
const router = express.Router();
const { generateAITasks } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Route to generate AI tasks for a project
router.post('/generate-tasks/:projectId', protect, generateAITasks);

module.exports = router;