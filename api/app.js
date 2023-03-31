const express = require("express");
const app = express();

const err = require("./controllers/error-handling.controllers");
const apiRouter = require("./routers/api.routers");
const categoriesRouters = require("./routers/categories.routers");
const commentsRouters = require("./routers/comments.routers");
const reviewsRouter = require("./routers/reviews.routers");
const usersRouters = require("./routers/users.routers");

app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/categories", categoriesRouters);
app.use("/api/users", usersRouters);
app.use("/api/comments", commentsRouters);

app.use("*", err.handleInvalidPath);
app.use(err.handleCustomErrors);
app.use(err.handlePSQLErrors);
app.use(err.unhandledErrors);

module.exports = app;
