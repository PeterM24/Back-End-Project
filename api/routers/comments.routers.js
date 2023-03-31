const { deleteComment } = require("../controllers/comments.controllers");

const commentsRouters = require("express").Router();

commentsRouters.delete("/:comment_id", deleteComment);

module.exports = commentsRouters;