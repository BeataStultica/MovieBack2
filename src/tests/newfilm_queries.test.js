process.env.NODE_ENV = 'test';
const db = require('../queries/pool');
const { getLastFilms } = require('../queries/newfilms_queries');
describe('GET new films', () => {
    test('GET new films', async (done) => {
        const films = await getLastFilms(db);
        expect(films.length).toEqual(6);
        done();
    });
});
