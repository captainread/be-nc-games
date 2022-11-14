const express = require("express");
const app = express();

const { getCategories } = require("./controllers/categories.controller");

app.use(express.json());

app.get("/api/categories/", getCategories);

// catch-all error handling for bad path
app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "404: Not Found" }).next(err);
});

// dynamic error handling
app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
