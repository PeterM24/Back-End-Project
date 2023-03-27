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
  if (req.params.review_id) {
    fetchReviewsById(req.params.review_id)
      .then((review) => {
        if (!review[0]) return Promise.reject({ msg: "404: ID not found", status: 404 });
        else res.status(200).send({ review: review[0] });
      })
      .catch((err) => {
        next(err);
      });
  }
};
