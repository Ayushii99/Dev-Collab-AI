const Project = require('../models/Project');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Please add a title and description' });
    }

    const project = await Project.create({
      title,
      description,
      owner: req.user._id, // Auth middleware se user ki ID mil jayegi
      members: [req.user._id], // Owner automatically member ban jayega
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all projects for logged-in user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    // Wo projects fetch karein jiska owner ya member current user hai
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).populate('owner', 'name email');

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  createProject,
  getProjects,
};