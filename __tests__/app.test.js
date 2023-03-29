const request = require("supertest");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const app = require("../api/app");

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));
afterAll(() => db.end());

describe("GET /api/categories", () => {
  test("200: should return an array of category objects with the properties slug and description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
        categories.forEach((obj) => {
          expect(obj).toBeInstanceOf(Object);
          expect(obj).toHaveProperty("slug");
          expect(obj).toHaveProperty("description");
        });
      });
  });
});

describe("Handle invalid paths", () => {
  test('404: should respond with an error "Path not found"', () => {
    return request(app)
      .get("/api/catgries") // any mispelled path
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid path");
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("200: should return a review object, with the appropriate keys", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject({
          review_id: 3,
          title: "Ultimate Werewolf",
          designer: "Akihisa Okui",
          owner: "bainesface",
          review_img_url:
            "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
          review_body: "We couldn't find the werewolf!",
          category: "social deduction",
          created_at: expect.any(String),
          votes: 5,
        });
      });
  });
  test("404: should return an error message when passed an invalid id", () => {
    return request(app)
      .get("/api/reviews/900000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
  test("400: Bad request should send an error message when passed an invalid type (e.g. string letters)", () => {
    return request(app)
      .get("/api/reviews/not_a_number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID, must be a number");
      });
  });
});

describe("GET /api/reviews", () => {
  test("200: returns with an array of review objects, with the correct properties", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("created_at", { descending: true });
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("404: returns with an error message when given an invalid path", () => {
    return request(app)
      .get("/api/review") // any mispelled path
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid path");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: returns an array of comments for the given review_id", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(3);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 3,
          });
        });
      });
  });
  test("200: should return an empty array if review has no comments", () => {
    return request(app)
      .get("/api/reviews/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(0);
      });
  });
  test("404: returns an error if id is not found", () => {
    return request(app)
      .get("/api/reviews/5000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
  test("400: returns an error when a bad request is made", () => {
    return request(app)
      .get("/api/reviews/not_a_number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID, must be a number");
      });
  });
});

describe("POST: /api/reviews/:review_id/comments", () => {
  const newComment = {
    username: "dav3rid",
    body: "Hello world!",
  };
  const invalidUser = {
    username: "peewee",
    body: "Hello world!",
  };
  test("201: returns the posted comment as an object", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: "dav3rid",
          body: "Hello world!",
          review_id: 1,
        });
      });
  });
  test("201: ignores unnecessary properties passed in post request", () => {
    const commentWithUnnecessaryProps = {
      username: "dav3rid",
      body: "Hello world!",
      unnecessary: "notNeeded"
    }
    return request(app)
      .post("/api/reviews/1/comments")
      .send(commentWithUnnecessaryProps)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: "dav3rid",
          body: "Hello world!",
          review_id: 1,
        });
      });
  });
  test("404: should return an invalid id error", () => {
    return request(app)
      .post("/api/reviews/10000/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
  test('404: Username does not exist - returns an error', () => {
    return request(app)
    .post("/api/reviews/1/comments")
    .send(invalidUser)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Username 'peewee' does not exist");
    });
  });
  test("400: should return bad request if id is NaN", () => {
    return request(app)
      .post("/api/reviews/not_a_num/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID, must be a number");
      });
  });
  test("400: should return bad request if posted object is incorrect format", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "dav3rid", body: 3 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid format");
      });
  });
  test("400: should return bad request if posted object has incorrect keys", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ dog: "dav3rid", cat: "Hello" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid format");
      });
  });
});

describe('PATCH /api/reviews/:review_id', () => {
  const increment = { inc_votes: 10 };
  const decrement = { inc_votes: -4 };
  const incorrectInputWithStr = { inc_votes: 'Hello' };
  const incorrectInput = { hello: 'there' };

  test('200: should return the updated review with incremented vote count', () => {
    return request(app)
      .patch('/api/reviews/3')
      .send(increment)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject({
          review_id: 3,
          title: 'Ultimate Werewolf',
          designer: 'Akihisa Okui',
          owner: 'bainesface',
          review_img_url:
            'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700',
          review_body: "We couldn't find the werewolf!",
          category: 'social deduction',
          created_at: expect.any(String),
          votes: 15 //increased from 5 to 15
        });
      });
  });

  test('200: should return the updated review with decremented vote count', () => {
    return request(app)
      .patch('/api/reviews/3')
      .send(decrement)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject({
          review_id: 3,
          title: 'Ultimate Werewolf',
          designer: 'Akihisa Okui',
          owner: 'bainesface',
          review_img_url:
            'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700',
          review_body: "We couldn't find the werewolf!",
          category: 'social deduction',
          created_at: expect.any(String),
          votes: 1 //increased from 5 to 10
        });
      });
  });

});