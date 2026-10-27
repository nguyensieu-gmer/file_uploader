const { Router } = require("express");
const uploadRouter = Router();
const uploadFileView = "home";
const upload = require("../lib/multer");
const prisma = require("../lib/prisma");

uploadRouter.get("/", (req, res) => {
  console.log("in upload page");
  res.render(uploadFileView);
});
uploadRouter.post("/", upload.single("file_upload"), async (req, res) => {
  const createDoc = await prisma.document.create({
    data: {
      userId: 1, // notice: req.user.id: user has been authenticated
      size: req.file.size,
      originalname: req.file.originalname,
      path: req.file.path,
      filename: req.file.filename,
    },
  });
  res.redirect("/");
});

module.exports = uploadRouter;

// {
//   fieldname: 'file_upload',
//   originalname: 'Screenshot 2026-10-19 at 20.25.52.png',
//   encoding: '7bit',
//   mimetype: 'image/png',
//   path: 'public/1792976801898.png',
//   destination: './public',
//   filename: '1792976801898.png',
//   size: 178821
// }
