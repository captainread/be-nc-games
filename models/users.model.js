const db = require("../db/connection");
const { checkExists } = require("../utilities/utils");

exports.selectUsers = () => {
  return db.query("SELECT * FROM users").then((result) => {
    return result.rows;
  });
};

exports.selectUsername = (username) => {
  return checkExists("users", "username", username)
    .then(() => {
      return db.query("SELECT * FROM users WHERE username = $1", [username]);
    })
    .then((result) => {
      return result.rows[0];
    });
};
