if (process.env.NODE_ENV || process.env.NODE_ENV === "local") {
  require("dotenv").config();
}
const express = require("express");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const routes = require("./routes");
const connectDB = require("./helper/db");
const bodyParser = require("body-parser");
const app = express();

app.use(require("cors")());
app.use(
  jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    algorithms: ["RS256"],
  })
);
app.use(bodyParser.json());

app.use("/user", routes.user);
app.use("/expertise", routes.expertise);
app.use("/learning", routes.learning);
app.use("/challenge", routes.challenge);

app.use(function (err, req, res, next) {
  res.status(500).json({ err: err.message || err });
});

connectDB(() => {
  app.listen(process.env.PORT);
});
