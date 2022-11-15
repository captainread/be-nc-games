const format = require("pg-format");

exports.checkExists = (table, column, value) => {
  const queryStr = format(
    "SELECT * FROM %I WHERE %I = %L;",
    table,
    column,
    value
  );
  return db.query(queryStr).then((res) => {
    if (res.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "404: Not Found " });
    }
  });
};
