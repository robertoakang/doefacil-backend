require('dotenv').config();
const Server = require('./config/fastify');
const db = require('./config/database/db');
const utils = require('./utils/util');

// eslint-disable-next-line func-names
(async function () {
    try {
        await db.sync();
        await utils.insertCategories();
        const server = new Server(false);
        await server.startServer();
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }
})();
