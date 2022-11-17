const {
  selectCommentsByReviewID,
  insertComment,
  removeCommentByID,
} = require("../models/comments.model");

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

exports.deleteComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  removeCommentByID(comment_id)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
};
