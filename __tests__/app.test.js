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

describe("ERROR DUE TO /invalid-route", () => {
  test("[Various] ERROR 404: returns an error for malformed URLs", () => {
    return request(app)
      .get("/bad-route")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });
});

describe("GET CATEGORIES FROM /api/categories", () => {
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

describe("GET REVIEWS FROM /api/reviews", () => {
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

describe("GET REVIEW FROM /api/reviews/:id", () => {
  test("[Ticket 5] GET REVIEW BY ID (200): responds with one matched review object with correct properties", () => {
    return request(app)
      .get("/api/reviews/1")
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
        };
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
        expect(body.review).toBeInstanceOf(Object);
        expect(body.review).toMatchObject(revObj);
        expect(body.review).toMatchObject(revObj1);
      });
  });

  test("[Ticket 5] GET REVIEW BY ID (404): error handling for non-existent review_ID", () => {
    return request(app)
      .get("/api/reviews/666")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });

  test("[Ticket 5] GET REVIEW BY ID (400): error handling for invalid review_ID (e.g. wrong data type)", () => {
    return request(app)
      .get("/api/reviews/stringyID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
});

describe("GET COMMENTS FROM /api/reviews/:review_id/comments", () => {
  test("[Ticket 6] GET COMMENTS BY REVIEW ID (200): responds with an array of comments (each with correct properties) for the given review_id. Comments are sorted by created_at date.", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        const commentObj = {
          comment_id: expect.any(Number),
          body: expect.any(String),
          review_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        };
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
        expect(Array.isArray(body.review)).toEqual(true);
        body.review.forEach((comment) => {
          expect(comment).toMatchObject(commentObj);
        });
        expect(body.review).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(body.review).toMatchObject(commentsForRev3);
      });
  });

  test("[Ticket 6] GET COMMENTS BY REVIEW ID (200): responds with an empty array where review_id is valid, but no comments have been written.", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.review)).toEqual(true);
        expect(body.review).toMatchObject([]);
      });
  });

  test("[Ticket 6] GET COMMENTS BY REVIEW ID (404): error handling for non-existent review_ID", () => {
    return request(app)
      .get("/api/reviews/666/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });

  test("[Ticket 6] GET COMMENTS BY REVIEW ID (400): error handling for invalid review_ID (e.g. wrong data type)", () => {
    return request(app)
      .get("/api/reviews/stringyID/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
});

describe("POST TO /api/reviews/:review_id/comments", () => {
  test("[Ticket 7] POST COMMENT (201): posts a comment (attached to given review_id) when request includes username and body", () => {
    const testComment = {
      username: "philippaclaire9",
      body: "Wow, what an excellent coding test!",
    };

    const testResult = {
      comment_id: expect.any(Number),
      body: "Wow, what an excellent coding test!",
      review_id: expect.any(Number),
      author: "philippaclaire9",
      votes: 0,
      created_at: expect.any(String),
    };

    return request(app)
      .post("/api/reviews/4/comments")
      .send(testComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.postedComment).toMatchObject(testResult);
      });
  });

  test("[Ticket 7] POST COMMENT (400): error handling for attempted comment with insufficient data, e.g. missing fields", () => {
    const noBodyComment = {
      username: "philippaclaire9",
    };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(noBodyComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });

  test("[Ticket 7] POST COMMENT (400): error handling for attempted comment with insufficient data, e.g. empty strings", () => {
    const emptyStrComment = {
      username: "philippaclaire9",
      body: "",
    };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(emptyStrComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });

  test("[Ticket 7] POST COMMENT (400): error handling for attempted comment with invalid review_ID, e.g. wrong data type", () => {
    const emptyStrComment = {
      username: "philippaclaire9",
      body: "A perfectly cromulent comment...",
    };
    return request(app)
      .post("/api/reviews/...butACrappyId/comments")
      .send(emptyStrComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });

  test("[Ticket 7] POST COMMENT (404): error handling for attempted comment for non-existent review_id", () => {
    const testComment666 = {
      username: "philippaclaire9",
      body: "I'm failing to comment on the Devil's Game!",
    };
    return request(app)
      .post("/api/reviews/666/comments")
      .send(testComment666)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });

  test("[Ticket 7] POST COMMENT (404): error handling for attempted comment by non-existent user", () => {
    const testCommentGhost = {
      username: "captainread",
      body: "Gee, I don't even have an account here...",
    };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(testCommentGhost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });
});

describe("PATCH VOTES AT /api/reviews/:review_id", () => {
  test("[Ticket 8] PATCH VOTES FOR REVIEW (200): *increases* the vote count for a valid review (when request includes inc_votes) and returns the updated review.", () => {
    const patchedReview4 = {
      review_id: expect.any(Number),
      title: "Dolor reprehenderit",
      category: "social deduction",
      designer: "Gamey McGameface",
      owner: "mallionaire",
      review_body:
        "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
      review_img_url:
        "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      created_at: expect.any(String),
      votes: 17,
    };
    return request(app)
      .patch("/api/reviews/4")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedReview.votes).toBe(17);
        expect(body.updatedReview).toMatchObject(patchedReview4);
      });
  });

  test("[Ticket 8] PATCH VOTES FOR REVIEW (200): *decreases* the vote count for a valid review (when request includes inc_votes) and returns the updated review", () => {
    const patchedReview4 = {
      review_id: expect.any(Number),
      title: "Dolor reprehenderit",
      category: "social deduction",
      designer: "Gamey McGameface",
      owner: "mallionaire",
      review_body:
        "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
      review_img_url:
        "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      created_at: expect.any(String),
      votes: 0,
    };
    return request(app)
      .patch("/api/reviews/4")
      .send({ inc_votes: -7 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedReview.votes).toBe(0);
        expect(body.updatedReview).toMatchObject(patchedReview4);
      });
  });

  test("[Ticket 8] PATCH VOTES FOR REVIEW (400): error handling for attempted vote patch with insufficient data, e.g. empty object/no inc_votes", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });

  test("[Ticket 8] PATCH VOTES FOR REVIEW (400): error handling for attempted vote patch with invalid data, e.g. invalid inc_votes value", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({ inc_votes: "ten cheeky little votes!" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });

  test("[Ticket 8] PATCH VOTES FOR REVIEW (400): error handling for attempted vote patch with invalid data, e.g. unecessary fields", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({
        inc_votes: 10,
        otherNonsense: "wots this doin here?",
        badStuff: true,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });

  test("[Ticket 8] PATCH VOTES FOR REVIEW (400): error handling for attempted vote patch with invalid review_ID, e.g. wrong data type", () => {
    return request(app)
      .patch("/api/reviews/ACrappyId")
      .send({ inc_votes: 10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });

  test("[Ticket 8] PATCH VOTES FOR REVIEW (404): error handling for attempted vote patch for non-existent review_id", () => {
    return request(app)
      .patch("/api/reviews/666")
      .send({ inc_votes: 10 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });
});
