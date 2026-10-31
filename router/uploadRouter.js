const { Router } = require("express");
const uploadRouter = Router();
const uploadFileView = "uploadFile";
const upload = require("../lib/multer");
const prisma = require("../lib/prisma");
const fs = require("node:fs/promises");
const path = require("node:path");
const FileExistErorr = require("../error/fileExistError");

uploadRouter.get("/file/:folderId", (req, res) => {
  res.render(uploadFileView, { folderId: req.params.folderId });
});

uploadRouter.post(
  "/:folderId",
  upload.single("file_upload"),
  async (req, res) => {
    const createDoc = await prisma.document.create({
      data: {
        folderId: 1 * req.params.folderId,
        size: req.file.size,
        originalname: req.file.originalname,
        path: req.file.path,
        filename: req.file.filename,
      },
    });
    res.redirect(`/folder/view/${req.params.folderId}`);
  },
);

uploadRouter.post("/delete/:docId/folder/:folderId", async (req, res) => {
  await prisma.document.delete({
    where: {
      folderId: 1 * req.params.folderId,
      id: 1 * req.params.docId,
    },
  });
  const linkFile = path.join(
    __dirname,
    "..",
    "public",
    "files",
    req.body.filename,
  );
  await fs.unlink(linkFile);
  res.redirect(`/folder/view/${req.params.folderId}`);
});

uploadRouter.post("/download/:docId/folder/:folderId", async (req, res) => {
  const file = await prisma.document.findUnique({
    where: {
      id: 1 * req.params.docId,
    },
  });

  if (!file) {
    throw new FileExistErorr(`This file doesn't exist`);
  }

  const filepath = path.join(
    __dirname,
    "..",
    "public",
    "files",
    req.body.filename,
  );
  res.download(filepath);
});

module.exports = uploadRouter;
