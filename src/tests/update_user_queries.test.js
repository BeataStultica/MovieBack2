process.env.NODE_ENV = 'test';
const db = require('../queries/pool');
const { changeUserInfo } = require('../queries/update_user_queries');

beforeAll(async (done) => {
    await db.query('call DeleteUser($1)', ['jesttestnew1']);
    await db.query('CALL UpdateUserInfo($1, $2, $3, $4, $5)', [
        'Dmytro',
        'Ukrainets',
        '2002-02-08',
        'Триллер',
        'dukrainets',
    ]);
    done();
});

describe('Add comment to film', () => {
    test('POST update user info', async (done) => {
        const olduser = await db.query('SELECT * from UserInfo($1)', [
            'dukrainets',
        ]);
        expect(olduser.rows[0].firstname).toEqual('Dmytro');
        expect(olduser.rows[0].secondname).toEqual('Ukrainets');
        expect(olduser.rows[0].bdate).toEqual('2002-02-08');
        expect(olduser.rows[0].favourgenre).toEqual('Триллер');
        await changeUserInfo(
            'jesttestname',
            'jesttestsecondname',
            '1999-01-02',
            'Комедия',
            'dukrainets',
            db
        );
        const upduser = await db.query('SELECT * from UserInfo($1)', [
            'dukrainets',
        ]);
        expect(upduser.rows[0].firstname).toEqual('jesttestname');
        expect(upduser.rows[0].secondname).toEqual('jesttestsecondname');
        expect(upduser.rows[0].bdate).toEqual('1999-01-02');
        expect(upduser.rows[0].favourgenre).toEqual('Комедия');
        done();
    });
});
