const app = require("./app");

app.listen(process.env.PORT || 3001, "0.0.0.0", (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
