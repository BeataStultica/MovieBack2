const changeUserInfo = async (
    firstname,
    secondname,
    bdate,
    favourgenre,
    login,
    pool
) => {
    await pool.query('CALL UpdateUserInfo($1, $2, $3, $4, $5)', [
        firstname,
        secondname,
        bdate,
        favourgenre,
        login,
    ]);
};

module.exports = { changeUserInfo };
