const { fetchUsers } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => res.status(200).send({ users }))
    .catch((err) => next(err));
};

exports.getUserById = async (req, res, next) => {
  const { username } = req.params;
  const user = await fetchUsers(username).catch((err) => next(err));
  res.status(200).send({ user });
};
