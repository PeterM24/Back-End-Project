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
const { checkValueExists } = require("../api/utils");

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
      unnecessary: "notNeeded",
    };
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
  test("404: Username does not exist - returns an error", () => {
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

describe("PATCH /api/reviews/:review_id", () => {
  const increment = { inc_votes: 10 };
  const decrement = { inc_votes: -4 };
  const incorrectInputWithStr = { inc_votes: "Hello" };
  const zero = { inc_votes: 0 };
  const incorrectInput = { hello: "there" };
  const unnecessaryKeys = { inc_votes: 10, unnecessary: "notNeeded" };

  test("200: should return the updated review with incremented vote count", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send(increment)
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
          votes: 15, //increased from 5 to 15
        });
      });
  });

  test("200: should return the updated review with decremented vote count", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send(decrement)
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
          votes: 1, //decreased from 5 to 1
        });
      });
  });

  test("200: returns original review, given an inc_vote of 0", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send(zero)
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
          votes: 5, //stays 0
        });
      });
  });

  test("400: returns bad request error, given invalid data type", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send(incorrectInputWithStr)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid format");
      });
  });

  test("400: returns bad request error, given invalid data id type", () => {
    return request(app)
      .patch("/api/reviews/not_a_number")
      .send(incorrectInputWithStr)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid format");
      });
  });

  test("200: ignores unnecessary properties within req object", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send(unnecessaryKeys)
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
          votes: 15,
        });
      });
  });

  test("400: returns error if not passed required keys", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send(incorrectInput)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid format");
      });
  });

  test("404: returns error if ID does not exist", () => {
    return request(app)
      .patch("/api/reviews/1000")
      .send(increment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("ID not found");
      });
  });
});

describe("checkValueExists util function", () => {
  test("returns true if value exists", () => {
    return checkValueExists("reviews", "review_id", 3).then((res) => {
      expect(res).toBe(true);
    });
  });

  test("returns false if value does not exists ", () => {
    return checkValueExists("users", "username", "hello").then((res) => {
      expect(res).toBe(false);
    });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes comment and responds with no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204);
  });
  test("404: comment not found", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Comment ID not found");
      });
  });
  test("400: Bad request - PSQL error handling when passed NaN", () => {
    return request(app)
      .delete("/api/comments/not_a_number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid ID, must be a number");
      });
  });
  test("204: comment should not exist after deleting", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return checkValueExists("comments", "comment_id", 1).then((res) => {
          expect(res).toBe(false);
        });
      });
  });
});

describe('GET /api/users', () => {
  test("200: should return an array of user objects with the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((obj) => {
          expect(obj).toBeInstanceOf(Object);
          expect(obj).toHaveProperty("username");
          expect(obj).toHaveProperty("name");
          expect(obj).toHaveProperty("avatar_url");
        });
      });
  });
  test('200: each user in users array should match object shape', () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((obj) => {
          expect(obj).toBeInstanceOf(Object);
          expect(obj).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          })
        });
      });
  });
});

describe('GET /api/reviews?query=x', () => {
  test('200: gets reviews by category=social-deduction', () => {
    return request(app)
    .get('/api/reviews?category=social-deduction')
    .expect(200)
    .then(({body}) => {
      expect(body.reviews).toBeInstanceOf(Array)
      expect(body.reviews).toHaveLength(11)
      body.reviews.forEach(review => {
        expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: "social deduction",
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
        })
      })
    })
  });
  test('200: gets reviews by category=dexterity', () => {
    return request(app)
    .get('/api/reviews?category=dexterity')
    .expect(200)
    .then(({body}) => {
      expect(body.reviews).toBeInstanceOf(Array)
      expect(body.reviews).toHaveLength(1)
      body.reviews.forEach(review => {
        expect(review).toMatchObject({
          owner: expect.any(String),
          title: expect.any(String),
          review_id: expect.any(Number),
          category: "dexterity",
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          designer: expect.any(String),
          comment_count: expect.any(Number),
        })
      })
    })
  });
  test('200: sort by votes column', () => {
    return request(app)
    .get("/api/reviews?sort_by=votes")
    .expect(200)
    .then(({ body }) => {
      const { reviews } = body;
      expect(reviews).toHaveLength(13);
      expect(reviews).toBeSortedBy("votes", { descending: true });
    });
  });
  test('200: sort by title column', () => {
    return request(app)
    .get("/api/reviews?sort_by=title")
    .expect(200)
    .then(({ body }) => {
      const { reviews } = body;
      expect(reviews).toHaveLength(13);
      expect(reviews).toBeSortedBy("title", { descending: true });
    });
  });
  test('200: order by asc', () => {
    return request(app)
    .get("/api/reviews?order=asc")
    .expect(200)
    .then(({ body }) => {
      const { reviews } = body;
      expect(reviews).toHaveLength(13);
      expect(reviews).toBeSortedBy("created_at", { ascending: true });
    });
  });
  test('200: order by desc', () => {
    return request(app)
    .get("/api/reviews?order=desc")
    .expect(200)
    .then(({ body }) => {
      const { reviews } = body;
      expect(reviews).toHaveLength(13);
      expect(reviews).toBeSortedBy("created_at", { descending: true });
    });
  });
  test('400: Bad request should return an error if sort_by column does not exist', () => {
    return request(app)
    .get("/api/reviews?sort_by=unknown")
    .expect(400)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("Invalid sort_by");
    });
  });
  test('400: Bad request returns an error if passed invalid order query: string', () => {
    return request(app)
    .get("/api/reviews?order=unknown")
    .expect(400)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("Invalid order: use DESC or ASC");
    });
  });
  test('400: Bad request returns an error if passed invalid order query: num', () => {
    return request(app)
    .get("/api/reviews?order=1")
    .expect(400)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("Invalid order: use DESC or ASC");
    });
  });
  test('404: category not found', () => {
    return request(app)
    .get("/api/reviews?category=hello")
    .expect(404)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("Category not found");
    });
  });
});