const { selectCategories } = require("../models/categories.model");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((category) => {
      res.status(200).send({ category });
    })
    .catch(next);
};

// exports.getTreasures = (req, res, next) => {
//   const { sort_by, order, colour } = req.query;
//   selectTreasures(sort_by, order, colour)
//     .then((treasures) => {
//       if (treasures.length === 0) {
//         res.status(404).send({ msg: "no matching treasures found" });
//       }
//       res.status(200).send({ treasures });
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
