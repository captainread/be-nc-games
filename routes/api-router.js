const apiRouter = require("express").Router();

const categoriesRouter = require("./categories-router");
const commentsRouter = require("./comments-router");
const reviewsRouter = require("./reviews-router");
const usersRouter = require("./users-router");

apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
