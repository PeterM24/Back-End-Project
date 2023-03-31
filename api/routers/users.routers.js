const { getUsers } = require("../controllers/users.controllers");

const usersRouters = require("express").Router();

usersRouters.get("/", getUsers);

module.exports = usersRouters;
