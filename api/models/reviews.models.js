const db = require("../../db/connection");
const { checkValueExists } = require("../utils");

exports.fetchReviewsById = (id) => {
  return db
    .query(
      `
  SELECT * FROM reviews
  WHERE review_id = $1;
  `,
      [id]
    )
    .then((res) => {
      if (res.rowCount === 0)
        return Promise.reject({ status: 404, msg: "ID not found" });
      return res.rows[0];
    });
};

exports.fetchAllReviews = () => {
  return db
    .query(
      `
  SELECT reviews.title, reviews.owner, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.review_id)::INT AS COMMENT_COUNT FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at DESC;
  `
    )
    .then((res) => res.rows);
};

exports.setReviewVotes = async (body, params) => {
  const { inc_votes } = body;
  const { review_id } = params;
  if (isNaN(inc_votes) || isNaN(review_id)) {
    return Promise.reject({ status: 400, msg: "Invalid format" });
  }

  const checkId = await checkValueExists("reviews", "review_id", review_id);
  if (!checkId) return Promise.reject({ status: 404, msg: "ID not found" });

  const review = await db.query(
    `
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;
    `,
    [inc_votes, review_id]
  );

  return review.rows[0];
};