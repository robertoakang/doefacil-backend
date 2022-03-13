const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../config/database/Models/User');
const utils = require('../../utils/util');
const emailProvider = require('../services/emailProvider');
const companyController = require('./company-controller');

class UserController {
    async createUser(req, res) {
        try {
            const { name, password, email, stepOnboarding } = req.body;
            const codeConfirm = utils.generateRandomCode();
            const expiresDate = utils.addMinutes(new Date(), 20);
            const encryptPassword = bcrypt.hashSync(
                password,
                parseInt(process.env.SALT_ROUNDS, 10)
            );

            await User.create({
                name,
                email,
                password: encryptPassword,
                codeConfirm,
                stepOnboarding,
                confirmed: false,
                dtExpireCodeConfirm: expiresDate,
            });

            await emailProvider.sendConfirmCode(email, name, codeConfirm);

            const { dataValues } = await User.findOne({
                where: { email },
            });

            delete dataValues.password;
            return res.code(200).send(dataValues);
        } catch (error) {
            return res.code(400).send({ response: 'Internal server error' });
        }
    }

    async confirmEmail(req, res) {
        try {
            const { code, email } = req.body;
            const user = await User.findOne({ where: { email } });
            const now = new Date();
            if (
                parseInt(code, 10) === parseInt(user.codeConfirm, 10) &&
                now <= user.dtExpireCodeConfirm
            ) {
                user.confirmed = true;
                await user.save();
                const payload = user.dataValues;
                delete payload.password;
                const token = jwt.sign(payload, process.env.TOKEN_KEY, {
                    expiresIn: '10h',
                });

                return res.code(200).send({ token, refreshToken: null });
            }
        } catch (error) {
            return res.code(400).send({ response: 'Internal server error' });
        }
        return false;
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { TOKEN_KEY } = process.env;

            if (!(email && password)) {
                res.code(400).send('All input is required');
            }

            const user = await User.findOne({ where: { email } });

            // Validações
            if (!user) return res.code(404).send('Usuário não encontrado');
            const { dataValues } = user;
            const compare = await bcrypt.compare(password, dataValues.password);

            if (!compare)
                return res.code(404).send('Usuário ou senha inválidos');

            if (!dataValues.confirmed)
                return res.code(401).send('Usuário não confirmado');

            const payload = dataValues;
            delete payload.password;
            const token = jwt.sign(payload, TOKEN_KEY, { expiresIn: '10h' });

            const company = companyController.getCompanyByUserId(payload.id);

            return res.status(200).send({
                user: payload,
                company,
                access: { token, refreshToken: null },
            });
        } catch (error) {
            return res.code(400).send({ response: 'Internal server error' });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            if (!user) return res.code(404).send('Usuário não encontrado');
            Object.keys(req.body).forEach((field) => {
                user[field] = req.body[field];
            });
            await user.save();
            delete user.dataValues.password;
            return res.status(200).send(user.dataValues);
        } catch (error) {
            return res.code(400).send({ response: 'Internal server error' });
        }
    }

    async getUser(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            if (!user) return res.code(404).send('Usuário não encontrado');
            delete user.dataValues.password;
            return res.status(200).send(user.dataValues);
        } catch (error) {
            return res.code(400).send({ response: 'Internal server error' });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            if (!user) return res.code(404).send('Usuário não encontrado');
            await companyController.deleteCompany(null, id);
            await User.destroy({ where: { id } });
            return res.status(200).send('ok');
        } catch (error) {
            return res.code(400).send({ response: 'Internal server error' });
        }
    }

    async emailChangeLogin(req, res) {
        try {
            const { id, email, name } = req.raw.user;
            const user = await User.findByPk(id);
            if (!user) return res.code(404).send('Usuário não encontrado');
            const codeConfirm = utils.generateRandomCode();
            const expiresDate = utils.addMinutes(new Date(), 20);
            user.codeConfirm = codeConfirm;
            user.dtExpireCodeConfirm = expiresDate;

            await user.save();
            await emailProvider.sendConfirmCodeEmailChange(
                email,
                name,
                codeConfirm
            );
            return res.status(200).send('ok');
        } catch (error) {
            return res.code(400).send({ response: 'Internal server error' });
        }
    }

    async emailChangePassword(req, res) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) return res.code(404).send('Usuário não encontrado');
            const codeConfirm = utils.generateRandomCode();
            const expiresDate = utils.addMinutes(new Date(), 20);
            user.codeConfirm = codeConfirm;
            user.dtExpireCodeConfirm = expiresDate;

            await user.save();
            await emailProvider.sendConfirmCodeEmailChangePassword(
                email,
                user.name,
                codeConfirm
            );

            return res
                .status(200)
                .send(`Código enviado para o email: ${user.email}`);
        } catch (error) {
            return res.code(400).send({ response: 'Internal server error' });
        }
    }

    async changeLogin(req, res) {
        try {
            const { user } = req.raw;
            const { code, email } = req.body;
            const userData = await User.findByPk(user.id);
            if (!userData) return res.code(404).send('Usuário não encontrado');
            const now = new Date();

            if (
                parseInt(code, 10) === parseInt(userData.codeConfirm, 10) &&
                now <= userData.dtExpireCodeConfirm
            ) {
                userData.email = email;
                await userData.save();

                return res.status(200).send('Login alterado com sucesso');
            }

            return res.code(500).send({ response: 'Falha ao alterar login' });
        } catch (error) {
            return res.code(400).send({ response: 'Internal server error' });
        }
    }

    async changePassword(req, res) {
        try {
            const { code, email, password } = req.body;
            const encryptPassword = bcrypt.hashSync(
                password,
                parseInt(process.env.SALT_ROUNDS, 10)
            );

            const user = await User.findOne({ where: { email } });
            if (!user) return res.code(404).send('Usuário não encontrado');
            const now = new Date();

            if (
                parseInt(code, 10) === parseInt(user.codeConfirm, 10) &&
                now <= user.dtExpireCodeConfirm
            ) {
                user.password = encryptPassword;
                await user.save();
                return res.status(200).send('Senha alterada com sucesso');
            }

            return res.code(500).send({ response: 'Falha ao alterar login' });
        } catch (error) {
            return res.code(400).send({ response: 'Internal server error' });
        }
    }
}

module.exports = new UserController();
