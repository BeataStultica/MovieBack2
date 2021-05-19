const HttpStatus = require('http-status');
const fs = require('fs');

function routes(fastify, opts, done) {
    fastify.get('/images/:file', (request, reply) => {
        const name = request.params.file;
        let films = null;
        if (name !== 'undefined' && name != 'null') {
            films = fs.createReadStream('./images/' + name);
        }
        reply.type('image/png');
        reply.status = HttpStatus.OK;
        reply.send(films);
    });
    done();
}

module.exports = routes;
