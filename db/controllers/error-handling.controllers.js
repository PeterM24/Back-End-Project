exports.handleInvalidPath = (req, res, next) => {
  res.status(404).send({ msg: "404: invalid path" });
};

exports.unhandledErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
