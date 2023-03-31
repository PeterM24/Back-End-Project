const fs = require("fs/promises");

exports.fetchApiEndpoints = async () => {
  const endpoints = await fs.readFile(`${__dirname}/../../endpoints.json`, `utf-8`);
  return endpoints;
};
