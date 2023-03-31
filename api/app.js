const express = require("express");
const { getApiEndpoints } = require("./controllers/api.controllers");
const { getCategories } = require("./controllers/categories.controllers");
const {
  getComments,
  postComment,
  deleteComment,
} = require("./controllers/comments.controllers");
postComment;
const {
  handleInvalidPath,
  unhandledErrors,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./controllers/error-handling.controllers");
const {
  getReviewsById,
  patchReview,
  getReviews,
} = require("./controllers/reviews.controllers");
const { getUsers } = require("./controllers/users.controllers");
const app = express();

app.use(express.json());

app.get("/api", getApiEndpoints);
app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewsById);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getComments);
app.get("/api/users", getUsers);
app.post("/api/reviews/:review_id/comments", postComment);
app.patch("/api/reviews/:review_id", patchReview);
app.delete("/api/comments/:comment_id", deleteComment);

app.use("*", handleInvalidPath);
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(unhandledErrors);

module.exports = app;
