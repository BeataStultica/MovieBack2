const { Pool } = require("pg");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
console.log(process.env.DATABASE_URL);
const db =
  process.env.NODE_ENV === "test" ? "movieplaza_test" : "da03vvrv0hhp7l";
const pool = new Pool({
  //connectionString: process.env.DATABASE_URL,
  user: "lmiadzbwcpstsz",
  host: "ec2-54-216-185-51.eu-west-1.compute.amazonaws.com",
  database: db,
  password: "f39cae1f7f55cd3cb16010e924eab745533c1eb9568e04f35ee92ea21ae0afa8",
  port: 5432,
  ssl: true,
  //ssl: { rejectUnauthorized: false },
});
pool.connect();

module.exports = pool;
