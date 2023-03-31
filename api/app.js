const express = require("express");
const app = express();

const {
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
const { getUsers } = require("./controllers/users.controllers");
const apiRouter = require("./routers/api.routers");
const categoriesRouters = require("./routers/categories.routers");
const reviewsRouter = require("./routers/reviews.routers");

app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/reviews", reviewsRouter)
app.use("/api/categories", categoriesRouters);
app.get("/api/users", getUsers);
app.delete("/api/comments/:comment_id", deleteComment);

app.use("*", handleInvalidPath);
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(unhandledErrors);

module.exports = app;
