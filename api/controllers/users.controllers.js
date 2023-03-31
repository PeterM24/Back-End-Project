const { fetchUsers } = require("../models/users.models");

exports.getUsers = async (req, res, next) => {
  try {
    res.send({ users: await fetchUsers() });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  const { username } = req.params;

  try {
    res.send({ user: await fetchUsers(username) });
  } catch (err) {
    next(err);
  }
};
