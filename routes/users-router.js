const { getUsers } = require("../controllers/users.controller");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers);

module.exports = usersRouter;
