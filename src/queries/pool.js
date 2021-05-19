const { Pool } = require("pg");
const env = require("./../../config/env");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
console.log(process.env.DATABASE_URL);
//const db =
//  process.env.NODE_ENV === "test" ? "movieplaza_test" : "da03vvrv0hhp7l";
const pool = new Pool({
  //connectionString: process.env.DATABASE_URL,
  user: env.username,
  host: env.host,
  database: env.database,
  password: env.password,
  port: env.port,
  ssl: true,
  //ssl: { rejectUnauthorized: false },
});
pool.connect((err) => {
  if (err) {
    console.log(err);
    return console.error("Error acquiring pool", err.stack);
  } else {
    console.log("thats fine");
  }
});

module.exports = pool;
