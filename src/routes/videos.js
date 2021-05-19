const fs = require('fs');

function routes(fastify, opts, done) {
    fastify.get('/videos/:file', (request, reply) => {
        const videoname = request.params.file;
        const path = './videos/' + videoname;
        const videolist = videoname.split('.');
        const videotype = videolist[videolist.length - 1];
        const stat = fs.statSync(path);
        const fileSize = stat.size;
        const range = request.headers.range;
        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = end - start + 1;
            const file = fs.createReadStream(path, { start, end });
            reply.headers({
                'Content-Type': 'video/' + videotype,
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Cache-Control': 'no-cache',
            });
            reply.type('video/mp4');
            reply.code(206);
            return file;
        } else {
            reply.headers({
                'Content-Type': 'video/' + videotype,
                'Accept-Ranges': 'bytes',
                'Content-Length': fileSize,
                'Cache-Control': 'no-cache',
            });

            reply.status = 200;
            return fs.createReadStream(path);
        }
    });
    done();
}
module.exports = routes;
