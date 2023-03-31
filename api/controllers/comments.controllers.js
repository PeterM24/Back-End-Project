const {
  fetchCommentsById,
  addComment,
  deleteCommentById,
} = require("../models/comments.models");

exports.getComments = async (req, res, next) => {
  const { review_id } = req.params;
  try {
    res.send({ comments: await fetchCommentsById(review_id) });
  } catch (err) {
    next(err);
  }
};

exports.postComment = async (req, res, next) => {
  try {
    res.status(201).send({ comment: await addComment(req.params, req.body) });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    await deleteCommentById(req.params);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
