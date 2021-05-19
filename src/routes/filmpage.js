const HttpStatus = require('http-status');
const { getFilms } = require('../queries/film_queries');
const pool = require('./../queries/pool');

function routes(fastify, opts, done) {
    fastify.get('/catalog/:id', (request, reply) => {
        const films = getFilms(request.params.id, pool);
        reply.status = HttpStatus.OK;
        reply.type = 'application/json';
        return films;
    });
    done();
}

module.exports = routes;
