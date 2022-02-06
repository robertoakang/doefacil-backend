/* eslint-disable no-restricted-syntax */
const googleApiProvider = require('../services/googleApiProvider');
const Company = require('../../config/database/Models/Company');
const CategoryCompany = require('../../config/database/Models/CategoryCompany');
const utils = require('../../utils/util');

class CompanyController {
    async createCompany(req, res) {
        try {
            const {
                cep,
                city,
                cnpj,
                district,
                idUser,
                name,
                number,
                state,
                street,
                tradingName,
            } = req.body;

            let company;

            const { candidates, status } =
                await googleApiProvider.getLocationByAddress(
                    `${street} ${number},${district}`
                );

            if (status === 'OK' && candidates.length > 0) {
                await Company.create({
                    cep,
                    city,
                    cnpj,
                    district,
                    name,
                    number,
                    state,
                    street,
                    tradingName,
                    latitude: candidates[0].geometry.location.lat,
                    longitude: candidates[0].geometry.location.lng,
                    userId: idUser,
                }).then((result) => {
                    const { dataValues } = result;
                    company = dataValues;
                });

                res.code(200).send(company);
            } else {
                throw new Error('Geolocalization not found');
            }
        } catch (error) {
            res.code(400).send({ response: 'Internal server error' });
        }
    }

    async updateCompany(req, res) {
        try {
            const { id } = req.params;
            const inserts = [];
            if (req.body.stepOnboarding) delete req.body.stepOnboarding;
            if (req.body.needs) req.body.needs = JSON.stringify(req.body.needs);
            const needs = JSON.parse(req.body.needs);
            const company = await Company.findByPk(id);
            if (!company) return res.code(404).send('Empresa não encontrada');
            Object.keys(req.body).forEach((field) => {
                company[field] = req.body[field];
            });

            needs.forEach((need) => {
                inserts.push({
                    categoryId: need,
                    companyId: id,
                });
            });

            await CategoryCompany.bulkCreate(inserts).then(() => true);
            await company.save();
            return res.code(200).send(company);
        } catch (error) {
            console.log(error);
            return res.code(500).send({ response: 'Internal server error' });
        }
    }

    async queryCompanies(req, res) {
        try {
            let companies;
            const { latitude, longitude } = req.query;
            const { needs } = req.body;
            const nearbyCompanies = [];

            if (needs && needs.length) {
                const categoryCompanies = await CategoryCompany.findAll({
                    where: {
                        categoryId: needs,
                    },
                });

                if (categoryCompanies.length) {
                    for (const result of categoryCompanies) {
                        // eslint-disable-next-line no-await-in-loop
                        const company = await Company.findOne({
                            where: { id: result.dataValues.companyId },
                        });
                        nearbyCompanies.push(company.dataValues);
                    }
                }
            } else {
                const { results, status } =
                    await googleApiProvider.getStateByLatLong(
                        `${latitude} ${longitude}`
                    );

                if (status !== 'OK') throw new Error('Error on google request');
                const companiesByState = await Company.findAll({
                    where: {
                        state: results[0].address_components[4].short_name,
                    },
                });

                for (const result of companiesByState) {
                    nearbyCompanies.push(result.dataValues);
                }
            }

            if (nearbyCompanies.length) {
                companies = await utils.getMapCompanies(
                    `${latitude} ${longitude}`,
                    nearbyCompanies
                );

                return res.code(200).send(companies);
            }
            return res.code(404).send('Não foi encontrada nenhuma instituição');
        } catch (error) {
            return res.code(500).send({ response: 'Internal server error' });
        }
    }

    async mapCompany(req, res) {
        try {
            let companies;
            const { id } = req.params;
            const { needs } = req.body;
            const nearbyCompanies = [];
            const originCompany = await Company.findByPk(id);
            if (!originCompany)
                return res.code(404).send('Empresa não encontrada');

            if (needs && needs.length) {
                const categoryCompanies = await CategoryCompany.findAll({
                    where: {
                        categoryId: needs,
                    },
                });

                if (categoryCompanies.length) {
                    for (const result of categoryCompanies) {
                        // eslint-disable-next-line no-await-in-loop
                        const company = await Company.findOne({
                            where: { id: result.dataValues.companyId },
                        });
                        nearbyCompanies.push(company.dataValues);
                    }
                }
            } else {
                const { results, status } =
                    await googleApiProvider.getStateByLatLong(
                        `${originCompany.latitude} ${originCompany.longitude}`
                    );

                if (status !== 'OK') throw new Error('Error on google request');

                const companiesByState = await Company.findAll({
                    where: {
                        state: results[0].address_components[4].short_name,
                    },
                });

                for (const result of companiesByState) {
                    nearbyCompanies.push(result.dataValues);
                }
            }

            if (nearbyCompanies.length) {
                companies = await utils.getMapCompanies(
                    `${originCompany.latitude} ${originCompany.longitude}`,
                    nearbyCompanies
                );

                companies.sort((a, b) => a.distance - b.distance);

                return res.code(200).send(companies);
            }
            return res.code(404).send('Não foi encontrada nenhuma instituição');
        } catch (error) {
            return res.code(500).send({ response: 'Internal server error' });
        }
    }

    async getCompanyByUserId(userId) {
        try {
            const company = await Company.findOne({ where: { userId } });
            if (company) {
                company.needs = JSON.parse(company.needs);
                return company;
            }
            return null;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deleteCompany(companyId, userId = null) {
        try {
            if (companyId === null) {
                const company = await this.getCompanyByUserId(userId);
                await Company.destroy({ where: { userId } });
                await CategoryCompany.destroy({
                    where: { companyId: company.id },
                });

                return true;
            }
            await Company.destroy({ where: { id: companyId } });
            await CategoryCompany.destroy({
                where: { companyId },
            });
            return true;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = new CompanyController();
