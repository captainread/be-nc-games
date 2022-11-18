const db = require("../db/connection");
const { checkExists } = require("../utilities/utils");

exports.selectCommentsByReviewID = (review_id) => {
  if (isNaN(review_id)) {
    return Promise.reject({ status: 400, msg: "400: Bad Request" });
  } else {
    return checkExists("reviews", "review_id", review_id)
      .then(() => {
        return db.query(
          `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
          [review_id]
        );
      })
      .then((result) => {
        return result.rows;
      });
  }
};

exports.insertComment = (review_id, newComment) => {
  if (
    !Object.keys(newComment).includes("username", "body") ||
    !newComment.body ||
    !newComment.username ||
    isNaN(review_id)
  ) {
    return Promise.reject({ status: 400, msg: "400: Bad Request" });
  } else {
    return Promise.all([
      checkExists("reviews", "review_id", review_id),
      checkExists("users", "username", newComment.username),
    ]).then(() => {
      let queryStr = `INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *;`;
      const queryVals = [review_id, newComment.username, newComment.body];
      return db.query(queryStr, queryVals).then((result) => {
        return result.rows[0];
      });
    });
  }
};

exports.removeCommentByID = (comment_id) => {
  if (isNaN(comment_id)) {
    return Promise.reject({ status: 400, msg: "400: Bad Request" });
  } else {
    return checkExists("comments", "comment_id", comment_id).then(() => {
      return db.query("DELETE FROM comments WHERE comment_id = $1", [
        comment_id,
      ]);
    });
  }
};

exports.updateCommentVotes = (comment_id, patchContent) => {
  if (
    !patchContent ||
    !Object.keys(patchContent).includes("inc_votes") ||
    Object.keys(patchContent).length > 1 ||
    isNaN(comment_id) ||
    typeof patchContent.inc_votes != "number"
  ) {
    return Promise.reject({ status: 400, msg: "400: Bad Request" });
  } else {
    return checkExists("comments", "comment_id", comment_id).then(() => {
      let queryStr =
        "UPDATE comments SET votes = votes + $2 WHERE comment_id = $1 RETURNING *;";
      const queryVals = [comment_id, patchContent.inc_votes];

      return db.query(queryStr, queryVals).then((result) => {
        return result.rows[0];
      });
    });
  }
};
