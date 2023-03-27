const db = require("../connection");

exports.fetchAllCategories = () => {
  return db
    .query(
      `
    SELECT * FROM categories;
    `
    )
    .then((res) => res.rows);
};

exports.fetchReviewsById = (id) => {
  return db
    .query(
      `
  SELECT * FROM reviews
  WHERE review_id = $1;
  `,
      [id]
    )
    .then((res) => res.rows);
};
