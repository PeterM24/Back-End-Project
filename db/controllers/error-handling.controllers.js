exports.handleInvalidPath = (req, res, next) => {
  res.status(404).send({ msg: "404: invalid path" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.unhandledErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
