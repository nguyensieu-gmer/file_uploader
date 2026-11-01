class FileLimitError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 413;
    this.name = "File limit error";
  }
}

module.exports = FileLimitError;
