const {
  fetchAllCategories,
  fetchReviewsById,
} = require("../models/app.models");

exports.getCategories = (req, res, next) => {
  fetchAllCategories()
    .then((categories) => res.status(200).send({ categories }))
    .catch((err) => next(err));
};

exports.getReviews = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewsById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
