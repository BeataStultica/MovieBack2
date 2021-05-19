const { getIsRegister } = require('../queries/registration_query');
const pool = require('./../queries/pool');

function routes(fastify, opts, done) {
    fastify.post('/registration', async (request) => {
        const {
            username,
            firstname,
            lastname,
            dateofbirthday,
            password,
        } = request.body;
        const user = await getIsRegister(
            username,
            password,
            dateofbirthday,
            firstname,
            lastname,
            pool
        );
        if (user) {
            request.session.authenticated = true;
            request.session.user = { name: username, id: user };
            request.sessionstorage = request.session;
            return { success: 'true', userid: user };
        } else {
            request.session.authenticated = false;
            return { success: 'false' };
        }
    });
    done();
}

module.exports = routes;
