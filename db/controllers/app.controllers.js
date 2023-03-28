const {
  fetchAllCategories,
  fetchReviewsById,
  fetchAllReviews,
  fetchCommentsById,
  addComment,
} = require("../models/app.models");

exports.getCategories = (req, res, next) => {
  fetchAllCategories()
    .then((categories) => res.status(200).send({ categories }))
    .catch((err) => next(err));
};

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

exports.getAllReviews = (req, res, next) => {
  fetchAllReviews()
    .then((reviews) => res.status(200).send({ reviews }))
    .catch((err) => next(err));
};

exports.getComments = (req, res, next) => {
  const { review_id } = req.params;
  fetchCommentsById(review_id)
    .then((comments) => res.status(200).send({ comments }))
    .catch((err) => next(err));
};

exports.postComment = (req, res, next) => {
  addComment(req.params, req.body)
    .then((comment) => res.status(201).send({ comment }))
    .catch((err) => {
      console.log(err)
      next(err)});
};
