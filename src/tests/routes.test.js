process.env.NODE_ENV = 'test';
const db = require('./../queries/pool');
const request = require('supertest');
const app = require('./../../app');

beforeAll(async (done) => {
    await db.query('call DeleteUser($1)', ['jesttestnew1']);
    await db.query(
        'DELETE FROM "Comments" WHERE "FilmId"=$1 AND "UserId" = $2',
        [2, 28]
    );
    await db.query('CALL UpdateUserInfo($1, $2, $3, $4, $5)', [
        'Dmytro',
        'Ukrainets',
        '2002-02-08',
        'Триллер',
        'dukrainets',
    ]);
    done();
});
beforeEach(async (done) => {
    await app.ready();
    done();
});
afterAll(async (done) => {
    db.end();
    done();
});

describe('routes test', () => {
    test('new film is awailable', async (done) => {
        const res = await request(app.server).get('/newfilms');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body.length).toEqual(6);
        expect(res.body[0]).toHaveProperty('filmname');
        done();
    });

    test('user image is awailable', async (done) => {
        const res = await request(app.server).get('/images/user.png');
        expect(res.body).toBeDefined();
        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toEqual('image/png');
        done();
    });
    test('user image is awailable', async (done) => {
        const res = await request(app.server).get('/images/undefined');
        expect(res.body).toBeDefined();
        expect(res.body.films).toEqual(undefined);
        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toEqual('image/png');

        done();
    });
    test('film is awailable', async (done) => {
        const res = await request(app.server).get('/videos/FilmName1.mp4');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.headers['content-type']).toEqual('video/mp4');
        expect(res.headers['accept-ranges']).toEqual('bytes');
        done();
        //expect(res.headers).toHaveProperty('content-length');
    });
    test('film-part is awailable', async (done) => {
        const res = await request(app.server)
            .get('/videos/FilmName1.mp4')
            .set('Range', 'bytes=0-300');
        expect(res.statusCode).toEqual(206);
        expect(res.body).toBeDefined();
        expect(res.headers['content-type']).toEqual('video/mp4');
        expect(res.headers['accept-ranges']).toEqual('bytes');
        done();
    });
    test('film-part end is awailable', async (done) => {
        const res = await request(app.server)
            .get('/videos/FilmName1.mp4')
            .set('Range', 'bytes=300-');
        expect(res.statusCode).toEqual(206);
        expect(res.body).toBeDefined();
        expect(res.headers['content-type']).toEqual('video/mp4');
        expect(res.headers['accept-ranges']).toEqual('bytes');
        done();
    });
    test('filmpage is awailable', async (done) => {
        const res = await request(app.server).get('/catalog/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('filmname');
        expect(res.body).toHaveProperty('genres');
        expect(res.body).toHaveProperty('comments');
        expect(res.body.genres).toContain('Комедия');
        expect(res.body.comments[0]).toHaveProperty('comments');
        done();
    });
    test('filter is work', async (done) => {
        const res = await request(app.server).get(
            '/catalog?value=&genre=%D0%9A%D0%BE%D0%BC%D0%B5%D0%B4%D0%B8%D1%8F&yearfrom=1997&yearto=2020&lenfrom=70&lento=130&pricefrom=&priceto=5&ratefrom=3&rateto='
        );
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        for (let i = 0; i < res.body.length; i++) {
            expect(Number(res.body[i].rate)).toBeGreaterThanOrEqual(3);
            expect(Number(res.body[i].dateofrelease)).toBeGreaterThanOrEqual(
                1997
            );
            expect(Number(res.body[i].dateofrelease)).toBeLessThanOrEqual(2020);
            expect(Number(res.body[i].duration)).toBeGreaterThanOrEqual(70);
            expect(Number(res.body[i].duration)).toBeLessThanOrEqual(130);
            expect(Number(res.body[i].price)).toBeLessThanOrEqual(5);
        }
        done();
    });
    test('search is work', async (done) => {
        const res = await request(app.server).get(
            '/catalog?value=%D0%A1%D0%B5%D0%BC%D0%B5%D0%B9%D0%BA%D0%B0'
        );
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        for (let i = 0; i < res.body.length; i++) {
            expect(res.body[i]).toHaveProperty('filmname');
            expect(res.body[i].filmname.toLowerCase()).toMatch(/семейка/);
        }
        done();
    });
    test('user profile is awailable', async (done) => {
        const res = await request(app.server).get('/profile/nproshyn');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('userid');
        expect(res.body.userid).toEqual(1);
        expect(res.body.firstname).toEqual('Nazarii');
        expect(res.body.secondname).toEqual('Proshyn');
        expect(res.body.bdate).toEqual('2001-10-05');
        expect(res.body.favourgenre).toEqual('Комедия');
        done();
    });
    test('user profile not found', async (done) => {
        const res = await request(app.server).get('/profile/nproshynqqqq');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body.status).toEqual('faled');
        done();
    });
    test('user data is awailable', async (done) => {
        const res = await request(app.server).get('/users/10');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('userid');
        expect(res.body.userid).toEqual(10);
        expect(res.body).toHaveProperty('login');
        expect(res.body.login).toEqual('test5');
        expect(res.body.firstname).toEqual('successtest');
        done();
    });
    test('is no logined', async (done) => {
        const res = await request(app.server).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('status');
        expect(res.body.status).toEqual('not_autorized');
        done();
    });
    test('is logined', async (done) => {
        const login = await request(app.server).post('/login').send({
            username: 'dukrainets',
            password: 'qwerty3',
        });
        const cookie = login.headers['set-cookie'][0].split(';')[0];
        const res = await request(app.server).get('/').set('Cookie', cookie);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toEqual(3);
        done();
    });
    test('logout', async (done) => {
        const login = await request(app.server).post('/login').send({
            username: 'dukrainets',
            password: 'qwerty3',
        });
        const cookie = login.headers['set-cookie'][0].split(';')[0];
        const res = await request(app.server)
            .get('/logout')
            .set('Cookie', cookie);
        expect(res.statusCode).toEqual(302);
        done();
    });
    test('logout is already', async (done) => {
        const res = await request(app.server).get('/logout');
        expect(res.statusCode).toEqual(302);
        expect(res.body).toBeDefined();
        done();
    });
    test('POST add comment', async (done) => {
        const res = await request(app.server).post('/commentadd').send({
            comments: 'jesttest',
            userid: 28,
            filmid: 2,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success');
        done();
    });
    test('POST login', async (done) => {
        const res = await request(app.server).post('/login').send({
            username: 'dukrainets',
            password: 'qwerty3',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body.success).toEqual('true');
        done();
    });
    test('POST login faile', async (done) => {
        const res = await request(app.server).post('/login').send({
            username: 'dukrainets',
            password: 'qwerty3hhhhhhh',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body.success).toEqual('false');
        done();
    });
    test('POST registration new user', async (done) => {
        const res = await request(app.server).post('/registration').send({
            username: 'jesttestnew1',
            firstname: 'Iae',
            lastname: 'Qah',
            dateofbirthday: '2020-02-04',
            password: 'qwerty4',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body.success).toEqual('true');
        done();
    });
    test('POST registration user is already registred', async (done) => {
        const res = await request(app.server).post('/registration').send({
            username: 'dukrainest',
            firstname: 'Iae',
            lastname: 'Qah',
            dateofbirthday: '2020-02-04',
            password: 'qwerty4',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body.success).toEqual('false');
        done();
    });
    test('POST update user info', async (done) => {
        const olduser = await request(app.server).get('/profile/dukrainets');
        expect(olduser.statusCode).toEqual(200);
        expect(olduser.body.firstname).toEqual('Dmytro');
        expect(olduser.body.secondname).toEqual('Ukrainets');
        expect(olduser.body.bdate).toEqual('2002-02-08');
        expect(olduser.body.favourgenre).toEqual('Триллер');
        const res = await request(app.server).post('/updateprofile').send({
            firstname: 'jesttestname',
            secondname: 'jesttestsecondname',
            bdate: '1999-01-02',
            favourgenre: 'Комедия',
            login: 'dukrainets',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body.success).toEqual('true');
        const upduser = await request(app.server).get('/profile/dukrainets');
        expect(upduser.statusCode).toEqual(200);
        expect(upduser.body.firstname).toEqual('jesttestname');
        expect(upduser.body.secondname).toEqual('jesttestsecondname');
        expect(upduser.body.bdate).toEqual('1999-01-02');
        expect(upduser.body.favourgenre).toEqual('Комедия');
        done();
    });
});
