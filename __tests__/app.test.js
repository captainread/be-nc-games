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
  test("[Ticket 3] GET CATEGORIES (200): responds with an array of category objects with correct properties", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.category)).toEqual(true);
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

describe("/api/reviews", () => {
  test("[Ticket 4] GET REVIEWS (200): responds with an array of review objects with correct properties", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const revObj = {
          review_id: expect.any(Number),
          title: expect.any(String),
          category: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        };
        expect(Array.isArray(body.review)).toEqual(true);
        expect(body.review.length).toBeGreaterThan(0);
        expect(body.review).toBeSortedBy("created_at", {
          descending: true,
        });
        body.review.forEach((review) => {
          expect(review).toMatchObject(revObj);
        });
      });
  });

  test("[Ticket 5] GET REVIEW BY ID (200): responds with one matched review object with correct properties", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        const revObj1 = {
          review_id: 1,
          title: "Agricola",
          review_body: "Farmyard fun!",
          designer: "Uwe Rosenberg",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: 1,
          category: "euro game",
          owner: "mallionaire",
          created_at: "2021-01-18T10:00:20.514Z",
        };
        const revObjKeys = [
          "review_id",
          "title",
          "category",
          "designer",
          "owner",
          "review_body",
          "review_img_url",
          "created_at",
          "votes",
        ];
        expect(body.review).toBeInstanceOf(Object);
        expect(Object.keys(body.review)).toEqual(revObjKeys);
        expect(body.review).toMatchObject(revObj1);
      });
  });

  test("[Ticket 5] GET REVIEW BY ID (404): error handling for non-existant ID", () => {
    return request(app)
      .get("/api/reviews/666")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Review ID Not Found");
      });
  });

  test("[Ticket 5] GET REVIEW BY ID (400): error handling for invalid ID (e.g. wrong data type)", () => {
    return request(app)
      .get("/api/reviews/stringyboi")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });


});
