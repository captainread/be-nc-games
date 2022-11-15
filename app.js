const express = require("express");
const app = express();

const { getCategories } = require("./controllers/categories.controller");
const {
  getReviews,
  getReviewByID,
  getCommentsByReviewID,
  postComment,
} = require("./controllers/reviews.controller");

app.use(express.json());

app.get("/api/categories/", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewByID);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewID);

app.post("/api/reviews/:review_id/comments", postComment);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "404: Not Found" });
});

module.exports = app;
