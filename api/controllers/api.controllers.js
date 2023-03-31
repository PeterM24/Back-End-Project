const { fetchApiEndpoints } = require("../models/api.models")

exports.getApiEndpoints = async (req, res, next) => {
    const endpoints = await fetchApiEndpoints();
    res.status(200).send({endpoints})
}