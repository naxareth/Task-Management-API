const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Project = require('./Project');

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Task title is required'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('to-do', 'in-progress', 'completed'),
    defaultValue: 'to-do'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

// Define relationships
// A Task belongs to a Project
Task.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project'
});

// A Project can have many Tasks
Project.hasMany(Task, {
  foreignKey: 'projectId',
  as: 'tasks'
});

// A Task can be assigned to a User
Task.belongsTo(User, {
  foreignKey: 'assignedTo',
  as: 'assignee'
});

// A User can have many assigned Tasks
User.hasMany(Task, {
  foreignKey: 'assignedTo',
  as: 'assignedTasks'
});

module.exports = Task;