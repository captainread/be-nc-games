const {
  selectReviews,
  selectReviewByID,
  selectCommentsByReviewID,
} = require("../models/reviews.model");

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getReviewByID = (req, res, next) => {
  const review_id = req.params.review_id;
  console.log(`Retrieving review "${review_id}"`);
  selectReviewByID(review_id)
  .then((review) => {
    if (review === undefined) {
      res.status(404).send({ msg: "404: Review ID Not Found" });
    }
    res.status(200).send({ review });
  })
  .catch(next);
};

exports.getCommentsByReviewID = (req, res, next) => {
  const review_id = req.params.id;
  console.log(`Retrieving comments for review "${review_id}"`);
  selectCommentsByReviewID(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
