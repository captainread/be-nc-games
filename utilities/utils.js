const format = require("pg-format");
const db = require("../db/connection");

exports.checkExists = (table, column, value) => {
  const queryStr = format(
    "SELECT * FROM %I WHERE %I = %L;",
    table,
    column,
    value
  );
  return db.query(queryStr).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "404: Not Found" });
    }
  });
};

exports.checkValidIDType = (id) => {
  if (isNaN(id)) {
    return Promise.reject({ status: 400, msg: "400: Bad Request" });
  } 
};
