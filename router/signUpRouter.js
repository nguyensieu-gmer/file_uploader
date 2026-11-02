const { Router } = require("express");
const signUpRouter = Router();
const signUpView = "sign-up";
const { body, matchedData, validationResult } = require("express-validator");
const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const passport = require("../config/passport");

const signUpController = require("../controller/signUpController");

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

signUpRouter.get("/", signUpController.getSignUp);
signUpRouter.post("/", signUpController.postSignUp);

module.exports = signUpRouter;
