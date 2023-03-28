const request = require("supertest");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const app = require("../db/app");

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

describe('GET /api/reviews/:review_id/comments', () => {
  test('200: returns an array of comments for the given review_id', () => {
      return request(app)
      .get('/api/reviews/3/comments')
      .expect(200)
      .then(({body}) => {
          const {comments} = body;
          expect(comments).toBeInstanceOf(Array)
          console.log(comments)
          expect(comments).toHaveLength(3)
          comments.forEach(comment => {
              expect(comment).toMatchObject({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                  review_id: expect.any(Number)
              })
          })
      })
  });
  test('404: returns an error if id is not found', () => {
      return request(app)
      .get('/api/reviews/5000/comments')
      .expect(404)
      .then(({body}) => {
          expect(body.msg).toBe('ID not found')
      })
  });
  test('400: returns an error when a bad request is made', () => {
    return request(app)
    .get('/api/reviews/not_a_number/comments')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid ID, must be a number");
    });
  });
});