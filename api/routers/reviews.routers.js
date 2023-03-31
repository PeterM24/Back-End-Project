const { getComments, postComment } = require("../controllers/comments.controllers");
const {
  getReviews,
  getReviewsById,
  patchReview,
} = require("../controllers/reviews.controllers");

const reviewsRouter = require("express").Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReviewsById);
reviewsRouter.patch("/:review_id", patchReview);
reviewsRouter.get("/:review_id/comments", getComments);
reviewsRouter.post("/:review_id/comments", postComment);


module.exports = reviewsRouter;
