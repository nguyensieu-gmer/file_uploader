const { Router } = require("express");
const logInRouter = Router();
const logInController = require("../controller/logInController");

logInRouter.get("/", logInController.getLogIn);
logInRouter.post("/", logInController.postLogIn);
logInRouter.get("/failure", logInController.getFailure);

module.exports = logInRouter;
