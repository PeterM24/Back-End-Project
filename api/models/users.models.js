const db = require("../../db/connection");

exports.fetchUsers = async (username) => {
  let queryStr = `SELECT * FROM users `;
  let user = [];
  username
    ? ((queryStr += `WHERE username = $1`), user.push(username))
    : queryStr;
  const res = await db.query(queryStr, user);
  
  return username ? res.rows[0] : res.rows;

  //     .then((res) => res.rows);
};