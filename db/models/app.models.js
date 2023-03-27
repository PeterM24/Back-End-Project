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
    .then((res) => {
      if (res.rowCount === 0)
        return Promise.reject({ status: 404, msg: "ID not found" });
      return res.rows[0];
    });
};
