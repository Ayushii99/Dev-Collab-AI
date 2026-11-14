const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a new task under a project
// @route   POST /api/tasks/:projectId
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, assignedTo } = req.body;
    const projectId = req.params.projectId;

    if (!title || !description) {
      return res.status(400).json({ message: 'Please add a title and description' });
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || 'Medium',
      project: projectId,
      assignedTo: assignedTo || req.user._id,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all tasks for a specific project
// @route   GET /api/tasks/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  createTask,
  getTasksByProject,
};