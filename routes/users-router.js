const { getUsers, getUsername } = require("../controllers/users.controller");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers);

usersRouter.route("/:username").get(getUsername);

module.exports = usersRouter;
