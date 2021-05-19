async function changefilm(room, film, pool) {
    await pool.query('DELETE FROM "Rooms" WHERE roomId = $1', [room]);
    await pool.query('INSERT INTO "Rooms"(roomId, film) VALUES($1, $2)', [
        room,
        film,
    ]);
}

async function getFilm(room, pool) {
    const film = await pool.query('SELECT * FROM "Rooms" WHERE roomId = $1', [
        room,
    ]);
    return film.rows[0];
}
// Join user to chat
async function userJoin(id, username, room, pool) {
    const user = { id, username, room };
    await pool.query(
        'INSERT INTO "UsersRoom"(socketId, username, room) VALUES($1, $2, $3)',
        [id, username, room]
    );
    return user;
}

// Get current user
async function getCurrentUser(id, pool) {
    const user = await pool.query(
        'SELECT * FROM "UsersRoom" WHERE socketId = $1',
        [id]
    );
    return user.rows[0];
}

// User leaves chat
async function userLeave(id, pool) {
    const user = await pool.query(
        'SELECT * FROM "UsersRoom" WHERE socketId = $1',
        [id]
    );
    const amountofuser = await pool.query(
        'SELECT COUNT(*) FROM "UsersRoom" WHERE room = $1',
        [user.rows[0].room]
    );
    if (amountofuser.rows[0].count === '1') {
        await pool.query('DELETE FROM "Rooms" WHERE roomId = $1', [
            user.rows[0].room,
        ]);
    }
    await pool.query('DELETE FROM "UsersRoom" WHERE socketId = $1', [id]);
    return user.rows[0];
}

// Get room users
async function getRoomUsers(room, pool) {
    const users = await pool.query(
        'SELECT * FROM "UsersRoom" WHERE room = $1',
        [room]
    );
    return users.rows;
}

module.exports = {
    getFilm,
    changefilm,
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
};
