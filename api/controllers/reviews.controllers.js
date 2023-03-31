const {
  fetchReviewsById,
  fetchAllReviews,
  setReviewVotes,
  fetchReviewsByQuery,
} = require("../models/reviews.models");

exports.getReviewsById = async (req, res, next) => {
  const { review_id } = req.params;
  try {
    res.send({ review: await fetchReviewsById(review_id) });
  } catch (err) {
    next(err);
  }
};

exports.getReviews = async (req, res, next) => {
  const { order, sort_by, category } = req.query;
  try {
    res.send({reviews: await fetchAllReviews(order, sort_by, category)})
  } catch (err) {
    next(err);
  }
};

exports.patchReview = async (req, res, next) => {
  try {
    res.send({review: await setReviewVotes(req.body, req.params)})
  } catch (err) {
    next(err)
  }
};
