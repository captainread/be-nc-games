const express = require("express");
const app = express();

const { getCategories } = require("./controllers/categories.controller");
const {
  getAllReviews,
  getReviewByID,
  patchReviewVotes,
} = require("./controllers/reviews.controller");
const {
  getCommentsByReviewID,
  postComment,
  deleteComment,
} = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/categories", getCategories);
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id", getReviewByID);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewID);
app.get("/api/users", getUsers);

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id", patchReviewVotes);

app.delete("/api/comments/:comment_id", deleteComment);

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
