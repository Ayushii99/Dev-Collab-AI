const { GoogleGenAI } = require('@google/genai');
const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Generate tasks automatically using Gemini AI based on project description
// @route   POST /api/ai/generate-tasks/:projectId
// @access  Private
const generateAITasks = async (req, res) => {
  try {

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const projectId = req.params.projectId;

    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const prompt = `You are an expert project manager. Based on the following project title and description, break it down into 4 to 5 essential, practical tasks. 
    
    Project Title: ${project.title}
    Project Description: ${project.description}

    You MUST return ONLY a valid JSON array of objects. No markdown formatting, no backticks, no introduction, no explanation. Each object must have these exact keys:
    - "title" (string)
    - "description" (string)
    - "priority" (string, must be either "Low", "Medium", or "High")`;

    // Call Gemini model (gem-2.5-flash or standard flash model)
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    let rawText = response.text.trim();
    
    // Clean up if model added markdown backticks
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const generatedTasks = JSON.parse(rawText);

    // Save generated tasks to database under this project
    const savedTasks = [];
    for (const t of generatedTasks) {
      const newTask = await Task.create({
        title: t.title,
        description: t.description,
        priority: t.priority || 'Medium',
        project: projectId,
        createdBy: req.user._id,
        assignedTo: req.user._id,
      });
      savedTasks.push(newTask);
    }

    res.status(201).json({
      message: 'AI Tasks generated successfully!',
      tasks: savedTasks,
    });
  } catch (error) {
    res.status(500).json({ message: `AI Error: ${error.message}` });
  }
};

module.exports = { generateAITasks };