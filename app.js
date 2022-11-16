const express = require("express");
const app = express();

const { getCategories } = require("./controllers/categories.controller");
const {
  getReviews,
  getReviewByID,
  getCommentsByReviewID,
  postComment,
  patchReviewVotes,
} = require("./controllers/reviews.controller");
const { getUsers } = require("./controllers/users.controller");

app.use(express.json());

app.get("/api/categories/", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewByID);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewID);
app.get("/api/users", getUsers);

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id", patchReviewVotes);

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
