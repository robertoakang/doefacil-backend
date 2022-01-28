const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sql/database.sqlite',
});

module.exports = sequelize;
