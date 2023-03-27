exports.handleInvalidPath = (req, res, next) => {
    const err = { msg: "404: invalid path" };
  res.status(404).send(err);
}