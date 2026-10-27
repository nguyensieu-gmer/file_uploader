const AuthenticatedError = require("../error/authenticatedError");

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    throw new AuthenticatedError(
      "You are not log in. Please login to use this feature",
    );
  }
};

module.exports = isAuth;
