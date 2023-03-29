const { fetchCommentsById, addComment } = require("../models/comments.models");

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
      next(err);
    });
};
