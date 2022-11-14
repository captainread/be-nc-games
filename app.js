const express = require("express");
const app = express();

const { getCategories } = require("./controllers/categories.controller");

app.use(express.json());

app.get("/api/categories/", getCategories);

app.use((err, req, res, next) => {
    res.status(err.status).send({ msg: err.msg }).next(err);
});

app.all("*", (req, res) => {
    console.log("catch all error 404 activated")
  res.status(404).send({ msg: "404: Not Found" });
});

module.exports = app;
