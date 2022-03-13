const nodemailer = require('nodemailer');

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
    },
});

transporter.verify().catch(console.error);

const emailProvider = {
    async sendConfirmCode(to, name, code) {
        transporter
            .sendMail({
                from: `"Doe Fácil" <${EMAIL_USERNAME}>`, // sender address
                to, // list of receivers
                subject: 'Código de confirmação - Doe Fácil ✔', // Subject line
                text: `Olá ${name},
                    Nós só precisamos verificar seu email antes de você acessar a plataforma da Doe.fácil!                
                    Utilize o seguinte código para verificar na plataforma: ${code}
                    Lembre-se, ele é válido por apenas 20 minutos.
                    Obrigado! &#8211; Equipe Doe.fácil`, // plain text body
                html: `Olá <b>${name}</b>,
                    <br /><br />
                    Nós só precisamos verificar seu email antes de você acessar a plataforma da <b>Doe.fácil</b>!
                    <br /><br />
                    Utilize o seguinte código para verificar na plataforma: <h1>${code}</h1>
                    Lembre-se, ele é válido por apenas <b>20 minutos</b>.
                    <br /><br />
                    Obrigado! &#8211; Equipe <b>Doe.fácil</b>`, // html body
            })
            .then((info) => info)
            .catch(console.error);
    },

    async sendConfirmCodeEmailChange(to, name, code) {
        transporter
            .sendMail({
                from: `"Doe Fácil" <${EMAIL_USERNAME}>`, // sender address
                to, // list of receivers
                subject: 'Redefinição de login - Doe Fácil ✔', // Subject line
                text: `Olá ${name},
                    Você fez um pedido de redefinição de login.
                    Utilize o seguinte código para verificar na plataforma: ${code}
                    Lembre-se, ele é válido por apenas 20 minutos.
                    Caso não tenha sido você, favor desconsiderar este email e redefinir a sua senha.
                    Obrigado! &#8211; Equipe Doe.fácil`, // plain text body
                html: `Olá <b>${name}</b>,
                    <br /><br />
                    Você fez um pedido de redefinição de login.
                    <br /><br />
                    Utilize o seguinte código para verificar na plataforma: <h1>${code}</h1>
                    Lembre-se, ele é válido por apenas <b>20 minutos</b>.
                    <br /><br />
                    Caso não tenha sido você, favor desconsiderar este email e redefinir a sua senha.
                    <br /><br />
                    Obrigado! &#8211; Equipe <b>Doe.fácil</b>`, // html body
            })
            .then((info) => info)
            .catch(console.error);
    },

    async sendConfirmCodeEmailChangePassword(to, name, code) {
        transporter
            .sendMail({
                from: `"Doe Fácil" <${EMAIL_USERNAME}>`, // sender address
                to, // list of receivers
                subject: 'Redefinição de senha - Doe Fácil ✔', // Subject line
                text: `Olá ${name},
                    Você fez um pedido de redefinição de senha.
                    Utilize o seguinte código para verificar na plataforma: ${code}
                    Lembre-se, ele é válido por apenas 20 minutos.
                    Caso não tenha sido você, favor desconsiderar este email e redefinir a sua senha e login.
                    Obrigado! &#8211; Equipe Doe.fácil`, // plain text body
                html: `Olá <b>${name}</b>,
                    <br /><br />
                    Você fez um pedido de redefinição de login.
                    <br /><br />
                    Utilize o seguinte código para verificar na plataforma: <h1>${code}</h1>
                    Lembre-se, ele é válido por apenas <b>20 minutos</b>.
                    <br /><br />
                    Caso não tenha sido você, favor desconsiderar este email e redefinir a sua senha e login.
                    <br /><br />
                    Obrigado! &#8211; Equipe <b>Doe.fácil</b>`, // html body
            })
            .then((info) => info)
            .catch(console.error);
    },
};

module.exports = emailProvider;
