const { getUsers, getUserById } = require("../controllers/users.controllers");

const usersRouters = require("express").Router();

usersRouters.get("/", getUsers);
usersRouters.get("/:username", getUserById)

module.exports = usersRouters;
