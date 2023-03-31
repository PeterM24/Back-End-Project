const {
  getComments,
  postComment,
} = require("../controllers/comments.controllers");
const {
  getReviews,
  getReviewsById,
  patchReview,
} = require("../controllers/reviews.controllers");

const reviewsRouter = require("express").Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.route("/:review_id").get(getReviewsById).patch(patchReview);
reviewsRouter.route("/:review_id/comments").get(getComments).post(postComment);

module.exports = reviewsRouter;
