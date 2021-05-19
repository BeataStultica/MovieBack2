const { changeUserInfo } = require('../queries/update_user_queries');
const pool = require('./../queries/pool');

function routes(fastify, opts, done) {
    fastify.post('/updateprofile', async (request) => {
        const {
            firstname,
            secondname,
            bdate,
            favourgenre,
            login,
        } = request.body;

        await changeUserInfo(
            firstname,
            secondname,
            bdate,
            favourgenre,
            login,
            pool
        );
        return { success: 'true' };
    });
    done();
}
module.exports = routes;
