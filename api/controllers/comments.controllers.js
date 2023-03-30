const {
  fetchCommentsById,
  addComment,
  deleteCommentById,
} = require("../models/comments.models");

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

exports.deleteComment = (req, res, next) => {
  deleteCommentById(req.params)
    .then(() => res.status(204).send({}))
    .catch((err) => next(err));
};
