const { selectUsers, selectUsername } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUsername = (req, res, next) => {
  const username =   req.params.username;
  selectUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
}