const { addComment } = require('../queries/comment_queries');
const pool = require('./../queries/pool');

function routes(fastify, opts, done) {
    fastify.post('/commentadd', async (request) => {
        const { comments, userid, filmid } = request.body;
        await addComment(filmid, comments, userid, pool);
        return { success: 'true' };
    });
    done();
}
module.exports = routes;
