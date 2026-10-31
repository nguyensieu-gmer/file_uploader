class FileExistError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = "FileExistError";
  }
}

module.exports = FileExistError;
