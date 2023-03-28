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

exports.fetchAllReviews = () => {
  return db
    .query(
      `
  SELECT reviews.title, reviews.owner, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.review_id)::INT AS COMMENT_COUNT FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at DESC;
  `
    )
    .then((res) => res.rows);
};

exports.fetchCommentsById = async (id) => {
  const checkIDExists = await db.query(
    `
  SELECT * FROM reviews
  WHERE review_id = $1;
  `,
    [id]
  );

  if (checkIDExists.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: "ID not found",
    });
  }

  const comments = await db.query(
    `
    SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;
    `,
    [id]
  );

  return comments.rows;
};

exports.addComment = async (id, commentValues) => {
  const { review_id } = id;
  const { username, body } = commentValues;
  if (typeof username !== 'string' || typeof body !== "string") {
    return Promise.reject({status:400, msg: "Invalid format"})
  }
  const checkIDExists = await db.query(
    `
    SELECT * FROM reviews
    WHERE review_id = $1;
    `,
    [review_id]
  );

  if (checkIDExists.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: "ID not found",
    });
  }

  const comment = await db.query(
    `
  INSERT INTO comments
  (author, body, review_id)
  VALUES ($1, $2, $3)
  RETURNING *;
  `,
    [username, body, review_id]
  );

  return comment.rows[0];
};
