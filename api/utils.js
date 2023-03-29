const db = require("../db/connection");

exports.checkValueExists = async (table, column, value) => {
  const checkExists = await db.query(
    `
      SELECT * FROM ${table}
      WHERE ${column} = $1;
      `,
    [value]
  );
  return checkExists.rowCount > 0;
};
