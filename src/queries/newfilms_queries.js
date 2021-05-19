const getLastFilms = async (pool) => {
    const lastfilm = await pool.query('SELECT * from LastFilms()');
    return lastfilm.rows;
};

module.exports = { getLastFilms };
