const express = require("express");
const app = express();

const { getCategories } = require("./controllers/categories.controller");
const { getReviews } = require("./controllers/reviews.controller");

app.use(express.json());

app.get("/api/categories/", getCategories);

app.get("/api/reviews", getReviews);

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg }).next(err);
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "404: Not Found" });
});

module.exports = app;
