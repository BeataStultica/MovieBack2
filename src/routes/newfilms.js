const HttpStatus = require('http-status');
const { getLastFilms } = require('../queries/newfilms_queries');
const pool = require('./../queries/pool');

function routes(fastify, opts, done) {
    fastify.get('/newfilms', (request, reply) => {
        const films = getLastFilms(pool);
        reply.status = HttpStatus.OK;
        return films;
    });
    done();
}

module.exports = routes;
