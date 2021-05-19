process.env.NODE_ENV = 'test';
const db = require('./../queries/pool');
const { getUser, getUserByLogin } = require('./../queries/users_queries');
describe('GET user by login or id', () => {
    test('GET user by id', async (done) => {
        const user = await getUser(2, db);
        expect(user.firstname).toEqual('Bogdan');
        expect(user.secondname).toEqual('Khersonskii');
        expect(user.bdate).toEqual('2001-12-07');
        expect(user.login).toEqual('bkhersonskii');
        expect(user.favourgenre).toEqual('Комедия');
        done();
    });
    test('GET user by login', async (done) => {
        const user = await getUserByLogin('bkhersonskii', db);
        expect(user.firstname).toEqual('Bogdan');
        expect(user.secondname).toEqual('Khersonskii');
        expect(user.bdate).toEqual('2001-12-07');
        expect(user.favourgenre).toEqual('Комедия');
        expect(user.userid).toEqual(2);
        done();
    });
    test('GET user by invalid login', async (done) => {
        const user = await getUserByLogin('bkhersonskiiiiiiiiii', db);
        expect(user.status).toEqual('faled');
        done();
    });
});
