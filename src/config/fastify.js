const fastify = require('fastify');
const fastifyExpress = require('fastify-express');
const fastifyCors = require('fastify-cors');
const routes = require('../api/routes/routes');
const utils = require('../utils/util');
const { authenticate } = require('../api/middlewares/auth');

const log = utils.debug('server');
const logError = utils.debug('error');

class Fastify {
    constructor(logger) {
        this.server = fastify({ logger });
        this.prefix = '/v1';
    }

    async setMiddlewares() {
        await this.server.register(fastifyExpress).after(() => {
            this.server.use(authenticate);
        });
    }

    async startServer() {
        try {
            await this.server.register(routes, { prefix: '/api/v1' });
            await this.server.register(fastifyCors, {
                origin: '*',
                methods: ['GET', 'DELETE', 'POST', 'PUT', 'PATCH'],
            });
            await this.setMiddlewares();
            this.server.listen(process.env.PORT || 30000, () => {
                log(`Server listening at port ${process.env.PORT}`);
                // eslint-disable-next-line no-console
                // console.log(this.server.printRoutes());
            });
        } catch (error) {
            logError(error);
        }
    }
}

module.exports = Fastify;
