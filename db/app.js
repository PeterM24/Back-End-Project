const express = require("express");
const { getCategories } = require("./controllers/app.controllers");
const { handleInvalidPath } = require("./controllers/error-handling.controllers");
const app = express();

app.get("/api/categories", getCategories);

app.use('*', handleInvalidPath)

module.exports = { app };
