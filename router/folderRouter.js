const { Router } = require("express");
const folderRouter = Router();
const { matchedData, body, validationResult } = require("express-validator");
const addFolderView = "addFolder";
const updateFolderView = "updateFolder";
const filesView = "files";
const prisma = require("../lib/prisma");

const validate = [
  body("foldername")
    .trim()
    .notEmpty()
    .withMessage("Your folder need a name. Please enter it's name"),
];

folderRouter.get("/", (req, res) => {
  res.render(addFolderView);
});

folderRouter.post("/add", validate, async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).render(addFolderView, { errors: result.array() });
  }
  const { foldername } = matchedData(req);
  try {
    await prisma.folder.create({
      data: {
        userId: req.user.id,
        name: foldername,
      },
    });
  } catch (e) {
    console.error(e);
  }
  res.redirect("/");
});

folderRouter.post("/delete/:folderId", async (req, res) => {
  try {
    await prisma.folder.delete({
      where: {
        id: req.params.folderId * 1,
      },
    });
  } catch (err) {
    console.log(err);
  }
  res.redirect("/");
});

folderRouter.get("/update/:folderId", (req, res) => {
  res.render(updateFolderView, { documentId: req.params.folderId });
});

folderRouter.post("/update/:folderId", validate, async (req, res) => {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    return res
      .status(400)
      .render(updateFolderView, { errors: results.array() });
  }
  const { foldername } = matchedData(req);
  await prisma.folder.update({
    where: { id: 1 * req.params.folderId },
    data: {
      name: foldername,
    },
  });
  res.redirect("/");
});

folderRouter.get("/view/:folderId", async (req, res) => {
  const folderId = req.params.folderId;
  const [fileList] = await prisma.folder.findMany({
    where: { userId: req.user.id, id: 1 * folderId },
    include: {
      documents: true,
    },
  });
  res.render(filesView, {
    name: fileList.name,
    folderId,
    documents: fileList.documents,
  });
});

module.exports = folderRouter;
