const fileLimitError = require("../error/fileLimitError");

const checkFileSize = (req, res, next) => {
  const file = req.file;
  if (!file) {
    next();
  }
  const isVideo = file.mimetype.startsWith("video/");
  const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new fileLimitError(
      `Your file is ${file.size}MB exceed ${maxSize}MB limitation`,
    );
  }
};

module.exports = checkFileSize;
