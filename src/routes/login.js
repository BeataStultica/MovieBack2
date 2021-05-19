const { getIsLogin } = require('../queries/login_queries');
const pool = require('./../queries/pool');

function routes(fastify, opts, done) {
    fastify.post('/login', async (request) => {
        const { username, password } = request.body;
        const user = await getIsLogin(username, password, pool);
        if (user) {
            request.session.authenticated = true;
            request.session.user = { name: username, id: user };
            request.sessionstorage = request.session;
            return { success: 'true' };
        } else {
            request.session.authenticated = false;
            return { success: 'false' };
        }
    });
    done();
}
module.exports = routes;
