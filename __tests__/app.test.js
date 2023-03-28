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
        expect(categories).toHaveLength(4)
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
          review_img_url: "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
          review_body: "We couldn't find the werewolf!",
          category: "social deduction",
          created_at: expect.any(String),
          votes: 5
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
