const isInvalid = (value) => {
    return !(
        value != null &&
        value != undefined &&
        value != 'null' &&
        value != '' &&
        value != false
    );
};
const getCatalog = async (
    filmname = '',
    genre,
    year_from,
    year_to,
    len_from,
    len_to,
    price_from,
    price_to,
    rate_from,
    rate_to,
    pool
) => {
    let querystr;
    let values = [
        isInvalid(year_from) ? 0 : year_from,
        isInvalid(year_to) ? 9999 : year_to,
        isInvalid(len_from) ? 0 : len_from,
        isInvalid(len_to) ? 9999 : len_to,
        isInvalid(price_from) ? 0 : price_from,
        isInvalid(price_to) ? 9999 : price_to,
        isInvalid(rate_from) ? 0 : rate_from,
        isInvalid(rate_to) ? 10 : rate_to,
    ];
    if (genre != undefined && genre != 'Жанр') {
        querystr =
            'SELECT * FROM SortFilms($1, $2, $3, $4, $5, $6, $7, $8, $9)';
        values.push(genre);
    } else {
        querystr =
            'SELECT * FROM SortFilmsWithoutGenreWithNAME($1, $2, $3, $4, $5, $6, $7, $8, $9)';
        values.push('%' + filmname + '%');
    }
    const films = await pool.query(querystr, values);
    return films.rows;
};

module.exports = { getCatalog };
