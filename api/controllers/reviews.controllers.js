const {
  fetchReviewsById,
  fetchAllReviews,
  setReviewVotes,
  fetchReviewsByQuery,
} = require("../models/reviews.models");

exports.getReviewsById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewsById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  const { order, sort_by, category } = req.query
  fetchAllReviews(order, sort_by, category)
    .then((reviews) => res.status(200).send({ reviews }))
    .catch((err) => next(err));
};

exports.patchReview = (req, res, next) => {
  setReviewVotes(req.body, req.params)
    .then((review) => res.status(200).send({ review }))
    .catch((err) => {
      next(err);
    });
};
