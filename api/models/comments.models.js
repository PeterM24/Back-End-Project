const db = require("../../db/connection");
const { checkValueExists } = require("../utils");

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
  if (typeof username !== "string" || typeof body !== "string") {
    return Promise.reject({ status: 400, msg: "Invalid format" });
  }

  const checkId = await checkValueExists("reviews", "review_id", review_id);
  if (!checkId) return Promise.reject({ status: 404, msg: "ID not found" });

  const checkUser = await checkValueExists("users", "username", username);
  if (!checkUser)
    return Promise.reject({
      status: 404,
      msg: `Username '${username}' does not exist`,
    });

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

exports.deleteCommentById = async (id) => {
const {comment_id} = id;

const checkId = await checkValueExists("comments", "comment_id", comment_id);
if (!checkId) return Promise.reject({ status: 404, msg: "Comment ID not found" });

const commentDeleted = await db.query(`
DELETE FROM comments
WHERE comment_id = $1
RETURNING *;
`, [comment_id])

if (commentDeleted.rowCount === 1) return {};
}