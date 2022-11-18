const { getCategories } = require("../controllers/categories.controller");

const categoriesRouter = require("express").Router();

categoriesRouter.route("/").get(getCategories)

module.exports = categoriesRouter