require('dotenv').config();
const Server = require('./config/fastify');
const db = require('./config/database/db');

// eslint-disable-next-line func-names
(async function () {
    try {
        await db.sync();
        const server = new Server(true);
        await server.startServer();
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }
})();
