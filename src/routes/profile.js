const HttpStatus = require('http-status');
const { getUserByLogin } = require('../queries/users_queries');
const pool = require('./../queries/pool');

function routes(fastify, opts, done) {
    fastify.get('/profile/:login', (request, reply) => {
        const users = getUserByLogin(request.params.login, pool);
        reply.status = HttpStatus.OK;
        return users;
    });
    done();
}

module.exports = routes;
