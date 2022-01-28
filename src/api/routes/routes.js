const { version } = require('../../../package.json');
const UserController = require('../controllers/user-controller');

module.exports = (http, opts, next) => {
    // Health check
    http.get('/ping', (req, res) => res.code(200).send('pong'));
    http.get('/version', (req, res) => res.code(200).send({ version }));

    // User
    http.post('/user/create', async (req, res) => {
        const user = await UserController.createUser(req.body);
        if (user) res.code(200).send(user);
        res.code(500).send({ response: 'Internal server error' });
    });

    http.post('/user/confirm-email', async (req, res) => {
        const token = await UserController.confirmEmail(req.body);
        if (token) res.code(200).send(token);
        res.code(400).send({ response: 'Internal server error' });
    });

    http.post('/login', UserController.login);
    http.put('/user/:id', UserController.updateUser);
    http.get('/user/:id', UserController.getUser);

    next();
};
