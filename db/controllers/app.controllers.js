const { fetchAllCategories } = require("../models/app.models")

exports.getCategories = (req, res, next) => {
    fetchAllCategories().then(categories => res.status(200).send({categories}))
    .catch(err => next(err))
}