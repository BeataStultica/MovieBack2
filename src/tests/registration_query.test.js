process.env.NODE_ENV = 'test';
const db = require('../queries/pool');
const { getIsRegister } = require('../queries/registration_query');

beforeAll(async (done) => {
    await db.query('call DeleteUser($1)', ['jesttestnew1']);
    done();
});

describe('User registration', () => {
    test('register new user', async (done) => {
        const isregister = await getIsRegister(
            'jesttestnew1',
            'qwerty4',
            '2020-02-04',
            'Iae',
            'Qah',
            db
        );
        expect(isregister).not.toBe(0);
        const upduser = await db.query('SELECT * from UserInfo($1)', [
            'jesttestnew1',
        ]);
        expect(upduser.rows[0].firstname).toEqual('Iae');
        expect(upduser.rows[0].secondname).toEqual('Qah');
        expect(upduser.rows[0].bdate).toEqual('2020-02-04');
        done();
    });
    test('register new user where login is already in use', async (done) => {
        const isregister = await getIsRegister(
            'dukrainets',
            'qwerty4',
            '2020-02-04',
            'Iae',
            'Qah',
            db
        );
        expect(isregister).toBe(0);
        done();
    });
});
