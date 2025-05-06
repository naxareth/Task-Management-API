const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    // Check if project exists and belongs to user
    const project = await Project.findOne({
      where: { 
        id: req.params.projectId,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const tasks = await Task.findAll({
      where: { projectId: req.params.projectId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
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

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          as: 'project'
        }
      ]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if task's project belongs to user
    if (task.project.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task'
      });
    }

    res.status(200).json({
      success: true,
      data: task
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

// @desc    Create new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    // Check if project exists and belongs to user
    const project = await Project.findOne({
      where: { 
        id: req.params.projectId,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Add project ID and creator to task
    req.body.projectId = req.params.projectId;
    req.body.createdBy = req.user.id;
    
    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: 'Invalid task data',
      error: error.message
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          as: 'project'
        }
      ]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if task's project belongs to user
    if (task.project.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    // Update task
    task = await task.update(req.body);

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: 'Invalid task data',
      error: error.message
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          as: 'project'
        }
      ]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if task's project belongs to user
    if (task.project.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    // Delete task
    await task.destroy();

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