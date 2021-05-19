const { Pool } = require("pg");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
console.log(process.env.DATABASE_URL);
const db =
  process.env.NODE_ENV === "test" ? "movieplaza_test" : "dboqj906ps4mnl";
const pool = new Pool({
  //connectionString: process.env.DATABASE_URL,
  user: "bshemyphktauco",
  host: "ec2-34-255-134-200.eu-west-1.compute.amazonaws.com",
  database: db,
  password: "97f8bea4d382c99b4749da4440914853debec42bdc83771aeaf13c1a7b1822a5",
  port: 5432,
  ssl: true,
  //ssl: { rejectUnauthorized: false },
});
pool.connect();

module.exports = pool;
