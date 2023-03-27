const { app } = require("../db/app");
const request = require("supertest");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));
afterAll(() => db.end());

describe("GET /api/categories", () => {
  test("200: should return an array of category objects with the properties slug and description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        categories.forEach((obj) => {
          expect(obj).toBeInstanceOf(Object);
          expect(obj).toHaveProperty("slug");
          expect(obj).toHaveProperty("description");
        });
      });
  });
});
