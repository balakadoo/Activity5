const { Sequelize } = require('sequelize');
const path = require('path');

// Create SQLite database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false,
  define: {
    timestamps: true,
    underscored: false
  }
});

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite database connected successfully');
  } catch (error) {
    console.error('Unable to connect to database:', error);
  }
};

module.exports = { sequelize, testConnection };