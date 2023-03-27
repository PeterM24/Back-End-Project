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
  if (req.params.review_id)
    fetchReviewsById(req.params.review_id)
      .then((review) => res.status(200).send({ review: review[0] }))
      .catch((err) => next(err));
};
