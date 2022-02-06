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
};

module.exports = emailProvider;
