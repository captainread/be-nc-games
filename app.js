const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const { getEndpoints } = require("./controllers/endpoints.controller");

app.use(express.json());

app.use("/api", apiRouter);

app.get("/api", getEndpoints);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.all("*", (req, res) => {
  res.status(404).send({
    msg: "404: Not Found",
  });
});

module.exports = app;
