const request = require("supertest");

const app = require("../app.js");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/not-a-route", () => {
  test("ERROR 404: returns an error for malformed URLs", () => {
    return request(app)
      .get("/bad-route")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });
});

describe("/api/categories", () => {
  test("GET 200: responds with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.category.length).toBeGreaterThan(0);
        body.category.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
