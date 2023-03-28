exports.handleInvalidPath = (req, res, next) => {
  res.status(404).send({ msg: "Invalid path" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID, must be a number" });
  }
  if (err.code === '23502') {
    res.status(400).send({ msg: "Invalid format" });
  }
  else {
    next(err);
  }
};

exports.unhandledErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
