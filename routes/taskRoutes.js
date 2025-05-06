const express = require('express');
const { 
  getTask, 
  updateTask, 
  deleteTask 
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;