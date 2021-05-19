const axios = require('axios');
const {
    getFilm,
    changefilm,
    userJoin,
    getCurrentUser,
    userLeave,
} = require('./queries/users');
const pool = require('./queries/pool');

function watchroomsocket(app) {
    return (err) => {
        if (err) throw err;
        app.io.on('connection', (socket) => {
            socket.on('join_room', async ({ username, room }) =>
                joinuser(username, room, socket)
            );
            socket.on('chat_message', async (message) =>
                chat_message(message, socket, app)
            );
            socket.on('play_video', async () => play_video(socket));
            socket.on('stop_video', async () => stop_video(socket));
            socket.on('seeked', async (time) => seek_video(time, socket));
            socket.on('change_src', async (filmname) =>
                change_src(filmname, socket, app)
            );
            socket.on('disconnect', async () => disconnect_user(socket, app));
        });
    };
}

const joinuser = async (username, room, socket) => {
    const user = await userJoin(socket.id, username, room, pool);
    socket.join(user.room);
    socket.emit('message', 'Welcome to the MoviePlaza! Room: ' + user.room);

    socket.broadcast
        .to(user.room)
        .emit('message', `${user.username} has joined the room`);
    socket.broadcast.to(user.room).emit('new_user');
    const film = await getFilm(user.room, pool);
    if (film) {
        socket.emit('change_src', film.film);
    }
};

const chat_message = async (message, socket, app) => {
    const user = await getCurrentUser(socket.id, pool);
    const user_data = await axios
        .get('http://localhost:3001/profile/' + user.username)
        .then((res) => res.data);
    let picture = 'user.png';

    if (user_data.userimage) {
        picture = user_data.userimage;
    }
    app.io.to(user.room).emit('chat_message', user.username, picture, message);
};

const play_video = async (socket) => {
    const user = await getCurrentUser(socket.id, pool);
    socket.broadcast.to(user.room).emit('play_video');
};

const stop_video = async (socket) => {
    const user = await getCurrentUser(socket.id, pool);
    socket.broadcast.to(user.room).emit('stop_video');
};

const seek_video = async (time, socket) => {
    const user = await getCurrentUser(socket.id, pool);
    socket.broadcast.to(user.room).emit('change_time', time);
};
const change_src = async (filmname, socket, app) => {
    const user = await getCurrentUser(socket.id, pool);
    await changefilm(user.room, filmname, pool);
    app.io.to(user.room).emit('change_src', filmname);
};
const disconnect_user = async (socket, app) => {
    const user = await userLeave(socket.id, pool);
    if (user) {
        app.io
            .to(user.room)
            .emit('message', `${user.username} has left the room`);
    }
};

module.exports = watchroomsocket;
