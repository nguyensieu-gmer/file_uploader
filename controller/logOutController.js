const getLogOut = (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
  });
  res.redirect("/");
};

module.exports = getLogOut;
