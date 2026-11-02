const { Router } = require("express");
const folderRouter = Router();
const { matchedData, body, validationResult } = require("express-validator");
const folderController = require("../controller/folderController");

folderRouter.get("/", folderController.getFolder);
folderRouter.post("/add", folderController.postAddFolder);
folderRouter.post("/delete/:folderId", folderController.postDeleteFolder);
folderRouter.get("/update/:folderId", folderController.getUpdateFolder);
folderRouter.post("/update/:folderId", folderController.postUpdateFolder);
folderRouter.get("/view/:folderId", folderController.getViewFolder);

module.exports = folderRouter;
