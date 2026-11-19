const Project = require('../models/Project');
const Task = require('../models/Task');

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

// @desc    Delete a project and its tasks
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this project' });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.status(200).json({ message: 'Project deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  createProject,
  getProjects,
  deleteProject,
};