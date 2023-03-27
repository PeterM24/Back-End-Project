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

describe('GET /api/categories', () => {
    test('200: should return an array of category objects with the properties slug and description', () => {
        request(app)
        .get('/api/categories')
        .expect(200)
        .then(({body}) => {
            expect(body).toBeInstanceOf(Array)
            body.forEach(obj => {
                expect(obj).toBeInstanceOf(Object)
                expect(obj).toHaveProperty("slug")
                expect(obj).toHaveProperty("description")
            })
        })
    });
});