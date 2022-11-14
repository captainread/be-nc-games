const { selectReviews, selectReviewByID } = require("../models/reviews.model");

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getReviewByID = (req, res, next) => {
  const review_id = req.params.review_id;
  console.log(`Retrieving review_id ${review_id}`);
  selectReviewByID(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
