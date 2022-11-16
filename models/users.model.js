const db = require("../db/connection");
const { checkExists } = require("../utilities/utils");

exports.selectUsers = () => {
  return db.query("SELECT * FROM users").then((result) => {
    return result.rows;
  });
};
