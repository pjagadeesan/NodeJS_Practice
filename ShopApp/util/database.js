const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'nodejs20', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
