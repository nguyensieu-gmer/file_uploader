const signUpView = "sign-upVibe";
const { body, matchedData, validationResult } = require("express-validator");
const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const passport = require("../config/passport");

const validation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage(
      "Please enter you name. We public it with everyone in this service",
    ),
  body("useremail")
    .trim()
    .isEmail()
    .withMessage("Your email is incorrect, please enter your email"),
  body("password").notEmpty().withMessage("Please enter your password"),
  body("confirm")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(
      "your confirm password is not same with password. Please try it again!",
    ),
];

const getSignUp = (req, res) => {
  res.render(signUpView);
};

const postSignUp = [
  validation,
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).render(signUpView, { errors: result.array() });
    }
    const { username, useremail, password } = matchedData(req);
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          name: username,
          email: useremail,
          password: hashedPassword,
        },
      });
    } catch (e) {
      return next(e);
    }
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureMessage: true,
  }),
];

module.exports = {
  getSignUp,
  postSignUp,
};
