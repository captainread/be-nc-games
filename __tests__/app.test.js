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
});

describe("/api/reviews/:id", () => {
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

describe.only("/api/reviews/:review_id/comments", () => {
  test("[Ticket 6] GET COMMENTS BY REVIEW ID (200): responds with an array of comments (each with correct properties) for the given review_id. Comments are sortred by created_at date.", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        const commentsForRev3 = [
          {
            comment_id: 6,
            body: "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
            review_id: 3,
            author: "philippaclaire9",
            votes: 10,
            created_at: "2021-03-27T19:49:48.110Z",
          },
          {
            comment_id: 3,
            body: "I didn't know dogs could play games",
            review_id: 3,
            author: "philippaclaire9",
            votes: 10,
            created_at: "2021-01-18T10:09:48.110Z",
          },
          {
            comment_id: 2,
            body: "My dog loved this game too!",
            review_id: 3,
            author: "mallionaire",
            votes: 13,
            created_at: "2021-01-18T10:09:05.410Z",
          },
        ];
        const commentObjKeys = [
          "comment_id",
          "body",
          "review_id",
          "author",
          "votes",
          "created_at",
        ];
        expect(Array.isArray(body.review)).toEqual(true);
        body.review.forEach((comment) => {
          expect(Object.keys(comment)).toEqual(commentObjKeys);
        });
        console.log(body.review);
        expect(body.review).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(body.review).toMatchObject(commentsForRev3);
      });
  });
});
