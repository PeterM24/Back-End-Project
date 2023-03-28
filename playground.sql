\c nc_games_test

SELECT reviews.title, reviews.owner, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.review_id)::INT AS COMMENT_COUNT FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at DESC;

SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;