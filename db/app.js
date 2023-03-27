const express = require("express");
const { getCategories, getReviews } = require("./controllers/app.controllers");
const {
  handleInvalidPath,
  unhandledErrors,
} = require("./controllers/error-handling.controllers");
const app = express();

app.get("/api/categories", getCategories);

app.get('/api/reviews/:review_id', getReviews)

app.use("*", handleInvalidPath);

app.use(unhandledErrors);

module.exports = app;
