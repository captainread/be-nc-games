const { selectCategories } = require("../models/categories.model");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((category) => {
      res.status(200).send({ category });
    })
    .catch(next);
};
