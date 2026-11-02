const logInView = "log-in";
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

  res.render("log-in", { error });
};

module.exports = {
  getLogIn,
  postLogIn,
  getFailure,
};
