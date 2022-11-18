const apiRouter = require("express").Router();
const categoriesRouter = require("./categories-router");
const reviewsRouter = require("./reviews-router");

// takes you to the relevant router file depending on URL
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/categories", categoriesRouter);

module.exports = apiRouter;
