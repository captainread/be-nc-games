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
