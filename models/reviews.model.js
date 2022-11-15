const db = require("../db/connection");

exports.selectReviews = () => {
  return db
    .query(
      "SELECT reviews.*, (SELECT COUNT(*)::int FROM comments) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id ORDER BY reviews.created_at DESC"
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectReviewByID = (review_id) => {
  if (isNaN(review_id)) {
    return Promise.reject({ status: 400, msg: "400: Bad Request" });
  } else {
    return db
      .query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
      .then((result) => {
        return result.rows[0];
      });
  }
};

exports.selectCommentsByReviewID = (review_id) => {
  return db
    .query(
      "SELECT comments.* FROM comments WHERE review_id = $1 ORDER BY comments.created_at DESC",
      [review_id]
    )
    .then((result) => {
      return result.rows;
    });
};
