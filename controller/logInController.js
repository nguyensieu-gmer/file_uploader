const logInView = "log-inVibe";
const passport = require("../config/passport");

const getLogIn = (req, res) => {
  res.render(logInView);
};

const postLogIn = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in/failure",
  failureMessage: true,
});

const getFailure = (req, res) => {
  const messages = req.session.messages || [];
  const error = messages.pop();

  res.render(logInView, { error });
};

module.exports = {
  getLogIn,
  postLogIn,
  getFailure,
};
