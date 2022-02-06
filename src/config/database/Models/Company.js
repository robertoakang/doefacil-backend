const Sequelize = require('sequelize');
const database = require('../db');
const User = require('./User');

const Company = database.define('company', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    latitude: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    longitude: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    tradingName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    cnpj: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    cep: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    street: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    number: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    district: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone: {
        type: Sequelize.STRING,
    },
    phoneWhatsapp: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
    },
    image: {
        type: Sequelize.STRING,
    },
    needs: {
        type: Sequelize.STRING,
    },
});

Company.belongsTo(User);

module.exports = Company;
