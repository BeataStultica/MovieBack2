const getIsRegister = async (
    login,
    password,
    bdate,
    firstname,
    lastname,
    pool
) => {
    const isNickFree = await pool.query('SELECT * from CheckNick($1)', [login]);

    if (isNickFree.rows[0].checknick === 1) {
        return 0;
    } else {
        await pool.query('CALL Registration($1, $2, $3, $4, $5)', [
            firstname,
            lastname,
            bdate,
            login,
            password,
        ]);
        const userId = await pool.query(
            'SELECT "UserId" FROM "UserInformation" WHERE "Login"=$1',
            [login]
        );
        return userId.rows[0].UserId;
    }
};

module.exports = { getIsRegister };
