const { Router } = require("express");
const logInRouter = Router();
const logInView = "log-in";
const passport = require("../config/passport");

logInRouter.get("/", (req, res) => {
  res.render(logInView);
});

logInRouter.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in/failure",
    failureMessage: true,
  }),
);

logInRouter.get("/failure", (req, res) => {
  const messages = req.session.messages || [];
  const error = messages.pop();

  res.render("log-in", { error });
});

module.exports = logInRouter;
