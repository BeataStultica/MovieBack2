const app = require("./app");

app.listen(process.env.PORT || 5000, "0.0.0.0", (err) => {
  console.log("Listening on " + process.env.PORT);
});
