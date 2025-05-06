const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Project = sequelize.define('Project', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Project name is required'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'on-hold'),
    defaultValue: 'active'
  }
}, {
  timestamps: true
});

// Define relationship: A Project belongs to a User (creator)
Project.belongsTo(User, {
  foreignKey: 'userId',
  as: 'creator'
});

// A User can have many Projects
User.hasMany(Project, {
  foreignKey: 'userId',
  as: 'projects'
});

module.exports = Project;