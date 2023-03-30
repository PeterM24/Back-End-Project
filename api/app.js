const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const { getComments, postComment, deleteComment } = require("./controllers/comments.controllers");
postComment
const {
  handleInvalidPath,
  unhandledErrors,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./controllers/error-handling.controllers");
const { getReviewsById, getAllReviews, patchReview } = require("./controllers/reviews.controllers");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewsById);
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id/comments", getComments);
app.post("/api/reviews/:review_id/comments", postComment);
app.patch('/api/reviews/:review_id', patchReview);
app.delete('/api/comments/:comment_id', deleteComment)

app.use("*", handleInvalidPath);
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(unhandledErrors);

module.exports = app;
