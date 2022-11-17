const {
  selectAllReviews,
  selectReviewByID,
  selectCommentsByReviewID,
  insertComment,
  updateReviewVotes,
} = require("../models/reviews.model");

exports.getAllReviews = (req, res, next) => {
  const { category, sort_by, order } = req.query;
  selectAllReviews(category, sort_by, order)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getReviewByID = (req, res, next) => {
  const review_id = req.params.review_id;
  selectReviewByID(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getCommentsByReviewID = (req, res, next) => {
  const review_id = req.params.review_id;
  selectCommentsByReviewID(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const review_id = req.params.review_id;
  const newComment = req.body;

  insertComment(review_id, newComment)
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch(next);
};

exports.patchReviewVotes = (req, res, next) => {
  const review_id = req.params.review_id;
  const patchContent = req.body;

  updateReviewVotes(review_id, patchContent)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
