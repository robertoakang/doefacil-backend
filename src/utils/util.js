const debug = require('debug');

const utils = {
    generateRandomCode() {
        return Math.floor(Math.random() * 90000) + 10000;
    },

    addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    },

    debug(name) {
        return debug('doefacil').extend(name);
    },
};

module.exports = utils;
