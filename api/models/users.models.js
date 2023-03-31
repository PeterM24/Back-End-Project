const db = require("../../db/connection");

exports.fetchUsers = async (username) => {
  let queryStr = `SELECT * FROM users `;
  let user = [];

  username
    ? ((queryStr += `WHERE username = $1`), user.push(username))
    : queryStr;
  const res = await db.query(queryStr, user);

  if (!res.rowCount)
    return Promise.reject({ status: 404, msg: "User not found" });

  return username ? res.rows[0] : res.rows;
};
