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
        // add arr length check
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
        expect(body.msg).toBe("404: invalid path");
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
        expect(review).toBeInstanceOf(Object)
        expect(review).toHaveProperty('review_id')
        expect(review).toHaveProperty('title')
        expect(review).toHaveProperty('review_body')
        expect(review).toHaveProperty('designer')
        expect(review).toHaveProperty('review_img_url')
        expect(review).toHaveProperty('votes')
        expect(review).toHaveProperty('category')
        expect(review).toHaveProperty('owner')
        expect(review).toHaveProperty('created_at')
      });
  });
  test('404: should return an error message when passed an invalid id', () => {
    return request(app)
    .get('/api/reviews/900000')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('404: ID not found')
    })
  });
});