const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../config/database/Models/User');
const utils = require('../../utils/util');
const emailProvider = require('../services/emailProvider');

class UserController {
    async createUser(body) {
        try {
            const codeConfirm = utils.generateRandomCode();
            const expiresDate = utils.addMinutes(new Date(), 20);
            const encryptPassword = bcrypt.hashSync(
                body.password,
                parseInt(process.env.SALT_ROUNDS, 10)
            );

            await User.create({
                name: body.name,
                email: body.email,
                password: encryptPassword,
                codeConfirm,
                stepOnboarding: body.stepOnboarding,
                confirmed: false,
                dtExpireCodeConfirm: expiresDate,
            });

            await emailProvider.sendConfirmCode(
                body.email,
                body.name,
                codeConfirm
            );

            const { dataValues } = await User.findOne({
                where: { email: body.email },
            });

            delete dataValues.password;
            return dataValues;
        } catch (error) {
            console.log(error);
        }
        return false;
    }

    async confirmEmail(body) {
        try {
            const user = await User.findOne({ where: { email: body.email } });
            const now = new Date();
            if (
                parseInt(body.code, 10) === parseInt(user.codeConfirm, 10) &&
                now <= user.dtExpireCodeConfirm
            ) {
                user.confirmed = true;
                await user.save();
                const payload = user.dataValues;
                delete payload.password;
                const token = jwt.sign(payload, process.env.TOKEN_KEY, {
                    expiresIn: '10h',
                });

                return { token, refreshToken: null };
            }
        } catch (error) {
            console.log(error);
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

            if (!bcrypt.compare(password, dataValues.password))
                return res.code(404).send('Usuário ou senha inválidos');

            if (!dataValues.confirmed)
                return res.code(401).send('Usuário não confirmado');

            const payload = dataValues;
            delete payload.password;
            const token = jwt.sign(payload, TOKEN_KEY, { expiresIn: '10h' });
            return res.status(200).send({
                user: payload,
                company: null,
                access: { token, refreshToken: null },
            });
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            if (!user) return res.code(404).send('Usuário não encontrado');
            await Object.keys(req.body).forEach((field) => {
                user[field] = req.body[field];
            });
            await user.save();
            delete user.dataValues.password;
            return res.status(200).send(user.dataValues);
        } catch (error) {
            console.log(error);
            return false;
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
            console.log(error);
            return false;
        }
    }
}

module.exports = new UserController();
