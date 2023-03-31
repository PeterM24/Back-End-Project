const db = require("../../db/connection");

exports.fetchAllCategories = async () => {
  const categories = await db.query(`SELECT * FROM categories;`)
  return categories.rows;
};
