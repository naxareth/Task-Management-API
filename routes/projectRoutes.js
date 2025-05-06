const express = require('express');
const { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject 
} = require('../controllers/projectController');
const { 
  getTasks, 
  createTask 
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Project routes
router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

// Task routes for a project
router.route('/:projectId/tasks')
  .get(getTasks)
  .post(createTask);

module.exports = router;