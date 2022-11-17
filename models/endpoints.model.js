const fs = require("fs");

exports.selectAllEndpoints = () => {
  const file = fs.readFileSync("./endpoints.json");
  const parsedFile = JSON.parse(file);
  return parsedFile;
};
