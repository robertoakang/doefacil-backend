const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const nonAuthRoutes = [
        '/api/v1/ping',
        '/api/v1/version',
        '/api/v1/user/create',
        '/api/v1/user/confirm-email',
        '/api/v1/login',
    ];
    if (nonAuthRoutes.includes(req.path)) return next();

    const { TOKEN_KEY } = process.env;

    let token = req.headers['x-access-token'] || req.headers.authorization;
    if (!token)
        return res
            .status(401)
            .json({ auth: false, message: 'No token provided.' });

    token = token.replace('Bearer ', '');
    jwt.verify(token, TOKEN_KEY, (err, payload) => {
        if (err && err.message.includes('jwt expired'))
            return res
                .status(401)
                .json({ auth: 'expired', message: 'Token expired.' });
        if (err)
            return res.status(500).json({
                auth: false,
                message: 'Failed to authenticate token.',
            });

        req.token = token;
        req.user = payload;
        return next();
    });

    return res.status(500);
};
