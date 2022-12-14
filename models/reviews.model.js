const e = require("express");
const db = require("../db/connection");
const { checkExists } = require("../utilities/utils");

exports.selectAllReviews = (
  category,
  sort_by = "created_at",
  order = "desc"
) => {
  const sortList = [
    "title",
    "designer",
    "owner",
    "review_id",
    "category",
    "created_at",
    "votes",
    "comment_count",
  ];

  const orderList = ["ASC", "asc", "DESC", "desc"];

  if (!sortList.includes(sort_by) || !orderList.includes(order)) {
    return Promise.reject({ status: 400, msg: "400: Bad Request" });
  }

  let queryStr =
    "SELECT reviews.*, COUNT(comments.comment_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id";

  const queryVals = [];

  if (category) {
    queryVals.push(category);
    queryStr += " WHERE category = $1";
  }

  queryStr += " GROUP BY reviews.review_id";
  queryStr += ` ORDER BY ${sort_by}`;
  queryStr += ` ${order}`;

  return db
    .query(`SELECT * FROM categories`)
    .then((result) => {
      if (
        !result.rows.map((cat) => cat.slug).includes(category) &&
        category !== undefined
      ) {
        return Promise.reject({ status: 404, msg: "404: Category Not Found" });
      }
    })
    .then(() => {
      return db.query(queryStr, queryVals);
    })
    .then((result) => {
      return result.rows;
    });
};

exports.selectReviewByID = (review_id) => {
  if (isNaN(review_id)) {
    return Promise.reject({ status: 400, msg: "400: Bad Request" });
  } else {
    return checkExists("reviews", "review_id", review_id)
      .then(() => {
        let queryStr =
          "SELECT reviews.*, (SELECT COUNT(*)::int FROM comments LEFT JOIN reviews ON reviews.review_id = comments.review_id WHERE comments.review_id = $1) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1";
        return db.query(queryStr, [review_id]);
      })
      .then((result) => {
        return result.rows[0];
      });
  }
};

exports.updateReviewVotes = (review_id, patchContent) => {
  if (
    !patchContent ||
    !Object.keys(patchContent).includes("inc_votes") ||
    Object.keys(patchContent).length > 1 ||
    isNaN(review_id) ||
    typeof patchContent.inc_votes != "number"
  ) {
    return Promise.reject({ status: 400, msg: "400: Bad Request" });
  } else {
    return checkExists("reviews", "review_id", review_id).then(() => {
      let queryStr =
        "UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *;";
      const queryVals = [review_id, patchContent.inc_votes];

      return db.query(queryStr, queryVals).then((result) => {
        return result.rows[0];
      });
    });
  }
};

exports.insertReview = (newReview) => {
  if (
    !Object.keys(newReview).includes(
      "title",
      "designer",
      "owner",
      "review_body",
      "category"
    ) ||
    !newReview.title ||
    !newReview.designer ||
    !newReview.owner ||
    !newReview.review_body ||
    !newReview.category
  ) {
    return Promise.reject({ status: 400, msg: "400: Bad Request" });
  } else {
    return Promise.all([
      checkExists("users", "username", newReview.owner),
      checkExists("categories", "slug", newReview.category),
    ]).then(() => {
      let queryStr = `INSERT INTO reviews (title, designer, owner, review_body, category) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
      const queryVals = [
        newReview.title,
        newReview.designer,
        newReview.owner,
        newReview.review_body,
        newReview.category,
      ];
      return db
        .query(queryStr, queryVals)
        .then((result) => {
          const generatedID = result.rows[0].review_id;
          let queryStr =
            "SELECT reviews.*, (SELECT COUNT(*)::int FROM comments LEFT JOIN reviews ON reviews.review_id = comments.review_id WHERE comments.review_id = $1) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1";
          return db.query(queryStr, [generatedID]);
        })
        .then((result2) => {
          return result2.rows[0];
        });
    });
  }
};
