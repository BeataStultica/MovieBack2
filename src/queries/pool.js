const { Pool, Client } = require("pg");
const env = require("./../../config/env");
//process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
console.log(process.env.DATABASE_URL);
//const db =
//  process.env.NODE_ENV === "test" ? "movieplaza_test" : "da03vvrv0hhp7l";
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const pgPoolWrapper = {
  async connect() {
    for (let nRetry = 1; ; nRetry++) {
      try {
        const client = await client.connect();
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

module.exports = client;
