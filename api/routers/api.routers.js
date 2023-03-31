const { getApiEndpoints } = require('../controllers/api.controllers');

const apiRouter = require('express').Router();

apiRouter.get('/', getApiEndpoints);

module.exports = apiRouter;