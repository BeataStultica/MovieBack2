process.env.NODE_ENV = 'test';
const db = require('../queries/pool');
const { addComment } = require('../queries/comment_queries');

beforeAll(async (done) => {
    await db.query(
        'DELETE FROM "Comments" WHERE "FilmId"=$1 AND "UserId" = $2',
        [2, 1]
    );
    done();
});
afterAll(async (done) => {
    await db.query(
        'DELETE FROM "Comments" WHERE "FilmId"=$1 AND "UserId" = $2',
        [2, 1]
    );
    db.end();
    done();
});

describe('Add comment to film', () => {
    test('Add comment', async (done) => {
        await addComment(2, 'unittest', 1, db);
        const comIndb = await db.query(
            'SELECT * FROM "Comments" WHERE "FilmId"=$1 AND "UserId"=$2 AND "Comment"=$3',
            [2, 1, 'unittest']
        );
        expect(comIndb.rows[0].FilmId).toEqual(2);
        expect(comIndb.rows[0].UserId).toEqual(1);
        expect(comIndb.rows[0].Comment).toEqual('unittest');
        expect(comIndb.rows[0]).toHaveProperty('commentdate');
        done();
    });
});
