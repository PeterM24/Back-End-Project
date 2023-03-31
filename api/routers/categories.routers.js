const { getCategories } = require('../controllers/categories.controllers');

const categoriesRouters = require('express').Router();

categoriesRouters.get('/', getCategories);



module.exports = categoriesRouters;