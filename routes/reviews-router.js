const {
  postComment,
  getCommentsByReviewID,
} = require("../controllers/comments.controller");
const {
  getAllReviews,
  getReviewByID,
  patchReviewVotes,
  postReview,
} = require("../controllers/reviews.controller");

const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getAllReviews).post(postReview);

reviewsRouter.route("/:review_id").get(getReviewByID).patch(patchReviewVotes);

reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewID)
  .post(postComment);

module.exports = reviewsRouter;
