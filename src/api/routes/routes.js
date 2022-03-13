const { version } = require('../../../package.json');
const UserController = require('../controllers/user-controller');
const CompanyController = require('../controllers/company-controller');

module.exports = (http, opts, next) => {
    // Health check
    http.get('/ping', (req, res) => res.code(200).send('pong'));
    http.get('/version', (req, res) => res.code(200).send({ version }));

    // User
    http.post('/user/create', UserController.createUser);
    http.post('/user/confirm-email', UserController.confirmEmail);
    http.post('/login', UserController.login);
    http.put('/user/:id', UserController.updateUser);
    http.get('/user/:id', UserController.getUser);
    http.post('/deleteUser/:id', UserController.deleteUser);
    http.post('/email-change-login', UserController.emailChangeLogin);
    http.post('/email-change-password', UserController.emailChangePassword);
    http.post('/change-login', UserController.changeLogin);
    http.post('/change-password', UserController.changePassword);

    // Company
    http.post('/company', CompanyController.createCompany);
    http.put('/company/:id', CompanyController.updateCompany);
    http.post('/queryCompanies', CompanyController.queryCompanies);
    http.post('/map-company/:id', CompanyController.mapCompany);
    http.get('/companyByUserId/:userId', async (req, res) => {
        await CompanyController.getCompanyByUserId(req.params.userId)
            .then((company) => res.code(200).send(company))
            .catch((err) => res.code(400).send(err));
    });

    next();
};
