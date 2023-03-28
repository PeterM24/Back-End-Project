const express = require("express");
const {
  getCategories,
  getReviewsById,
  getAllReviews,
  getComments,
  postComment,
} = require("./controllers/app.controllers");
const {
  handleInvalidPath,
  unhandledErrors,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./controllers/error-handling.controllers");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewsById);
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id/comments", getComments);
app.post("/api/reviews/:review_id/comments", postComment);

app.use("*", handleInvalidPath);
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(unhandledErrors);

module.exports = app;
