process.env.NODE_ENV = 'test';
const db = require('../queries/pool');
const { getIsLogin } = require('../queries/login_queries');
describe('get is user login and password allow to enter', () => {
    test('is user login and password allow to enter', async (done) => {
        const films = await getIsLogin('dukrainets', 'qwerty3', db);
        expect(films).toEqual(3);
        done();
    });
});
