const debug = require('debug');
const categoryProvider = require('../api/services/categoryProvider');
const googleApiProvider = require('../api/services/googleApiProvider');
const Category = require('../config/database/Models/Category');

const utils = {
    generateRandomCode() {
        return Math.floor(Math.random() * 90000) + 10000;
    },

    addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    },

    async insertCategories() {
        if (await Category.findByPk(1)) return true;
        const inserts = [];
        const CATEGORIES = categoryProvider.getAllCategories();
        Object.keys(CATEGORIES).forEach(async (field) => {
            inserts.push({
                name: CATEGORIES[field],
            });
        });

        const response = await Category.bulkCreate(inserts).then(() => true);
        if (response) return true;
        throw new Error(`Category inserts failed`);
    },

    async getMapCompanies(originAddress, companies) {
        const formattedComapanies = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const company of companies) {
            const { rows } =
                // eslint-disable-next-line no-await-in-loop
                await googleApiProvider.getDistanceMatrix(
                    originAddress,
                    `${company.latitude} ${company.longitude}`
                );
            let distanceCompany;
            if (rows[0].elements[0].distance.value) {
                distanceCompany = rows[0].elements[0].distance.value;
            } else {
                distanceCompany = null;
            }
            const formattedCompany = {
                lat: company.latitude,
                long: company.longitude,
                distance: distanceCompany,
                id_company: company.id,
                name: company.name,
                street: company.street,
                number: company.number,
                district: company.district,
                city: company.city,
                state: company.state,
                cep: company.cep,
                phone: company.phone,
                needs: JSON.parse(company.needs),
            };
            formattedComapanies.push(formattedCompany);
        }
        return formattedComapanies;
    },

    debug(name) {
        return debug('doefacil').extend(name);
    },
};

module.exports = utils;
