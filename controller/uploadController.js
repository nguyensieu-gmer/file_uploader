const uploadFileView = "uploadFile";
const upload = require("../lib/multer");
const prisma = require("../lib/prisma");
const fs = require("node:fs/promises");
const path = require("node:path"); // notice: could be not used
const FileExistErorr = require("../error/fileExistError");
const cloudinary = require("../config/cloudinary");
const checkFileSize = require("../config/checkFileSize");

const deleteLocalFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
};

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "uploads",
      use_filename: true,
      unique_filename: true,
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

const getUpload = (req, res) => {
  res.render(uploadFileView, { folderId: req.params.folderId });
};

const postUpload = [
  upload.single("file_upload"),
  async (req, res) => {
    if (!req.file) {
      console.log("file not found!");
      throw new FileExistErorr("You need to upload a file!");
    }
    // upload file into cloudinary
    try {
      // upload file into cloudinary
      const result = await uploadToCloudinary(req.file.path);

      // update into database
      const createDoc = await prisma.document.create({
        data: {
          folderId: 1 * req.params.folderId,
          size: req.file.size,
          originalname: req.file.originalname,
          path: req.file.path,
          filename: req.file.filename,
          resource_type: result.resource_type,
          doc_link: result.secure_url,
          public_id: result.public_id,
          asset_id: result.asset_id,
        },
      });

      // delete local file
      await deleteLocalFile(req.file.path);
    } catch (error) {
      // delete local file
      await deleteLocalFile(req.file.path);
      console.error(error);
    }
    res.redirect(`/folder/view/${req.params.folderId}`);
  },
];

const postDeleteDoc = async (req, res) => {
  try {
    await prisma.document.delete({
      where: {
        folderId: 1 * req.params.folderId,
        id: 1 * req.params.docId,
      },
    });
  } catch (error) {
    console.log(error);
  }
  try {
    await cloudinary.uploader.destroy(req.body.public_id, {
      resource_type: req.body.resource_type,
      invalidate: true,
    });
  } catch (error) {
    console.log(error);
  }
  res.redirect(`/folder/view/${req.params.folderId}`);
};

const postDownload = async (req, res) => {
  const downloadUrl = cloudinary.url(req.body.public_id, {
    resource_type: req.body.resource_type,
    type: "upload",
    flags: "attachment",
    secure: true,
  });
  res.redirect(downloadUrl);
};

module.exports = {
  getUpload,
  postUpload,
  postDeleteDoc,
  postDownload,
};

// file uploaded by multer eg: {
//   fieldname: 'file_upload',
//   originalname: 'Screenshot 2026-10-30 at 10.34.36.png',
//   encoding: '7bit',
//   mimetype: 'image/png',
//   path: 'public/files/1793456366672.png',
//   destination: './public/files',
//   filename: '1793456366672.png',
//   size: 525190
// }

// Cloudinary upload result eg: {
//   asset_id: '55430cac272cd0957c5cb8b42a0cf375',
//   public_id: 'uploads/1793457909177_z9zs0k',
//   version: 1793457911,
//   version_id: 'dae91f50a3ab5effb9a4fa662d66cc1a',
//   signature: 'dd48762917887b572fdfb2dd6ff84cd55f7ed854',
//   width: 4160,
//   height: 6240,
//   format: 'jpg',
//   resource_type: 'image',
//   created_at: '2026-10-31T14:45:11Z',
//   tags: [],
//   bytes: 3109393,
//   type: 'upload',
//   etag: '944f9746f2adfb1e9383f7759be85869',
//   placeholder: false,
//   url: 'http://res.cloudinary.com/srjxbyag/image/upload/v1793457911/uploads/1793457909177_z9zs0k.jpg',
//   secure_url: 'https://res.cloudinary.com/srjxbyag/image/upload/v1793457911/uploads/1793457909177_z9zs0k.jpg',
//   asset_folder: 'uploads',
//   display_name: '1793457909177_z9zs0k',
//   original_filename: '1793457909177',
//   api_key: '427182869741184'
// }
