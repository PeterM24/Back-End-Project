const { fetchAllCategories } = require("../models/categories.models");

exports.getCategories = async (req, res, next) => {
  try {
    res.send({ categories: await fetchAllCategories() });
  } catch (err) {
    next(err);
  }
};
