const express = require("express");
const { getCategories } = require("./controllers/app.controllers");
const {
  handleInvalidPath,
  unhandledErrors,
} = require("./controllers/error-handling.controllers");
const app = express();

app.get("/api/categories", getCategories);

app.use("*", handleInvalidPath);

app.use(unhandledErrors);

module.exports = app;
