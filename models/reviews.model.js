const db = require("../db/connection");
const { checkExists } = require("../utilities/utils");

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

  // ATTEMPTING TO GET UTILITY FUNCTION WORKING, TUTOR PLS IGNORE:
  // return checkExists(review_id)
  //   .then(() => {
  //     return db.query(
  //       `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
  //       [review_id]
  //     );
  //   })
  //   .then((result) => {
  //     return result.rows;
  //   });

  if (isNaN(review_id)) {
    return Promise.reject({ status: 400, msg: "400: Bad Request" });
  } else {
    return db
      .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "404: Review ID Not Found",
          });
        } else {
          return db
            .query(
              `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
              [review_id]
            )
            .then((res) => {
              return res.rows;
            });
        }
      });
  }
};
