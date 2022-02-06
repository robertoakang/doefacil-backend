const Sequelize = require('sequelize');
const database = require('../db');

const CategoryCompany = database.define('category_company', {
    categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = CategoryCompany;
