process.env.NODE_ENV = 'test';
const db = require('./../queries/pool');
const {
    getFilm,
    changefilm,
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
} = require('./../queries/users');

beforeEach(async (done) => {
    await db.query('DELETE FROM "Rooms"');
    await db.query('DELETE FROM "UsersRoom"');
    done();
});
afterAll(async (done) => {
    await db.query('DELETE FROM "Rooms"');
    await db.query('DELETE FROM "UsersRoom"');
    done();
});
describe('sockets queries', () => {
    test('GET room film', async (done) => {
        await changefilm(
            'ef5623db-675a-4ace-abe4-5b67dc3ea650',
            'FilmName1',
            db
        );
        const getfilm = await getFilm(
            'ef5623db-675a-4ace-abe4-5b67dc3ea650',
            db
        );
        expect(getfilm.film).toEqual('FilmName1');
        done();
    });
    test('GET current user ', async (done) => {
        const newuser = await userJoin(
            'OH1CgccaFqMZcPcMAAAD',
            'dukrainets',
            'ef5623db-675a-4ace-abe4-5b67dc3ea650',
            db
        );
        expect(newuser.username).toEqual('dukrainets');
        const getcuruser = await getCurrentUser('OH1CgccaFqMZcPcMAAAD', db);
        expect(getcuruser.username).toEqual('dukrainets');
        done();
    });
    test('user leave last', async (done) => {
        await userJoin(
            'OH1CgccaFqMZcPcMAAAD',
            'dukrainets',
            'ef5623db-675a-4ace-abe4-5b67dc3ea650',
            db
        );
        const getcuruser = await userLeave('OH1CgccaFqMZcPcMAAAD', db);
        expect(getcuruser.username).toEqual('dukrainets');
        done();
    });
    test('user leave', async (done) => {
        await userJoin(
            'OH1CgccaFqMZcPcMAAAD',
            'dukrainets',
            'ef5623db-675a-4ace-abe4-5b67dc3ea650',
            db
        );
        await userJoin(
            'OH1CgccaFqMZcPcMRRRK',
            'dukrainets2',
            'ef5623db-675a-4ace-abe4-5b67dc3ea650',
            db
        );
        const getcuruser = await userLeave('OH1CgccaFqMZcPcMAAAD', db);
        expect(getcuruser.username).toEqual('dukrainets');
        done();
    });
    test('room user', async (done) => {
        await userJoin(
            'OH1CgccaFqMZcPcMAAAD',
            'dukrainets',
            'ef5623db-675a-4ace-abe4-5b67dc3ea650',
            db
        );
        const roomuser = await getRoomUsers(
            'ef5623db-675a-4ace-abe4-5b67dc3ea650',
            db
        );
        expect(roomuser[0]).toHaveProperty('username');
        done();
    });
});
