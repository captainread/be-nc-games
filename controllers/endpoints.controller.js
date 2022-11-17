const { selectAllEndpoints } = require("../models/endpoints.model");

exports.getEndpoints = (req, res, next) => {
  const file = selectAllEndpoints();
  res.status(200).send(file);
};
