const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get all projects for current user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        {
          model: Task,
          as: 'tasks'
        }
      ]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    // Add user ID to project
    req.body.userId = req.user.id;
    
    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: 'Invalid project data',
      error: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Update project
    project = await project.update(req.body);

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: 'Invalid project data',
      error: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Delete project
    await project.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};