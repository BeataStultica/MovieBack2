const fastify = require('fastify');
const app = fastify();
const fastifySession = require('fastify-session');
const fastifyCookie = require('fastify-cookie');
app.register(fastifyCookie);

app.register(require('fastify-socket.io'), {
    cors: { origin: '*' },
});

const pgSession = require('connect-pg-simple')(fastifySession);

app.register(fastifySession, {
    store: new pgSession({
        conString:
            'postgres://movieadmin1:movieadmin@localhost:5432/movieplaza',
        tableName: 'session',
    }),
    cookieName: 'sessionId',
    secret: '1qwqwqwwhjehu2372e8ywhdhu92e8uids',
    cookie: { secure: false, path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 }, //срок дії cookie 7 днів, протокол http(secure: false)
});

app.register(require('fastify-cors'), {
    origin: 'http://localhost:3000',

    credentials: 'same-origin',
    allowMethods:
        'PROPFIND, PROPPATCH, COPY, MOVE, DELETE, MKCOL, LOCK, UNLOCK, PUT, GETLIB, VERSION-CONTROL, CHECKIN, CHECKOUT, UNCHECKOUT, REPORT, UPDATE, CANCELUPLOAD, HEAD, OPTIONS, GET, POST',
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'X-Custom-Header',
        'X-Requested-With',
        'Cookie',
    ],
});

app.register(require('./src/routes/index'));
app.register(require('./src/routes/login'));
app.register(require('./src/routes/filmImg'));
app.register(require('./src/routes/filmpage'));
app.register(require('./src/routes/newfilms'));
app.register(require('./src/routes/filmsearch'));
app.register(require('./src/routes/users'));
app.register(require('./src/routes/profile'));
app.register(require('./src/routes/videos'));
app.register(require('./src/routes/registration'));
app.register(require('./src/routes/commentadd'));
app.register(require('./src/routes/update_user'));
const sock = require('./src/sockets')(app);
app.ready(sock);

module.exports = app;
