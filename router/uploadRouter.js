const { Router } = require("express");
const uploadRouter = Router();
const uploadController = require("../controller/uploadController");

uploadRouter.get("/file/:folderId", uploadController.getUpload);
uploadRouter.post("/:folderId", uploadController.postUpload);
uploadRouter.post(
  "/delete/:docId/folder/:folderId",
  uploadController.postDeleteDoc,
);
uploadRouter.post(
  "/download/:docId/folder/:folderId",
  uploadController.postDownload,
);

module.exports = uploadRouter;
