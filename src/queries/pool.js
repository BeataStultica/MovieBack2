const { Pool } = require("pg");
const env = require("./../../config/env");
//process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
console.log(process.env.DATABASE_URL);
//const db =
//  process.env.NODE_ENV === "test" ? "movieplaza_test" : "da03vvrv0hhp7l";
const pool = new Pool({
  connectionString:
    "postgres://lmiadzbwcpstsz:f39cae1f7f55cd3cb16010e924eab745533c1eb9568e04f35ee92ea21ae0afa8@ec2-54-216-185-51.eu-west-1.compute.amazonaws.com/da03vvrv0hhp7l",
  //host: "ec2-54-216-185-51.eu-west-1.compute.amazonaws.com",
  //database: "da03vvrv0hhp7l",
  //user: "lmiadzbwcpstsz",
  //password: "f39cae1f7f55cd3cb16010e924eab745533c1eb9568e04f35ee92ea21ae0afa8",
  ssl: { rejectUnauthorized: false },
});
const pgPoolWrapper = {
  async connect() {
    for (let nRetry = 1; ; nRetry++) {
      try {
        const client = await pool.connect();
        if (nRetry > 1) {
          console.info("Now successfully connected to Postgres");
        }
        return client;
      } catch (e) {
        if (e.toString().includes("ECONNREFUSED") && nRetry < 5) {
          console.info(
            "ECONNREFUSED connecting to Postgres, " +
              "maybe container is not ready yet, will retry " +
              nRetry
          );
          // Wait 1 second
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          throw e;
        }
      }
    }
  },
};

module.exports = pool;
