process.env.NODE_ENV = 'test';
const db = require('../queries/pool');
const { getCatalog } = require('../queries/catalog_queries');
describe('GET film', () => {
    test('GET film', async (done) => {
        const films = await getCatalog(
            '',
            'Комедия',
            1997,
            2020,
            70,
            130,
            0,
            5,
            3,
            '',
            db
        );
        for (let i = 0; i < films.length; i++) {
            expect(Number(films[i].rate)).toBeGreaterThanOrEqual(3);
            expect(Number(films[i].dateofrelease)).toBeGreaterThanOrEqual(1997);
            expect(Number(films[i].dateofrelease)).toBeLessThanOrEqual(2020);
            expect(Number(films[i].duration)).toBeGreaterThanOrEqual(70);
            expect(Number(films[i].duration)).toBeLessThanOrEqual(130);
            expect(Number(films[i].price)).toBeLessThanOrEqual(5);
        }
        done();
    });
    test('GET film by name', async (done) => {
        const films = await getCatalog(
            'Семейка',
            undefined,
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            db
        );
        for (let i = 0; i < films.length; i++) {
            expect(films[i]).toHaveProperty('filmname');
            expect(films[i].filmname.toLowerCase()).toMatch(/семейка/);
        }
        done();
    });
});
