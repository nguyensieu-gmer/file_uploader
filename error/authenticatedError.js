class AuthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = "Authenticated Error";
  }
}

module.exports = AuthenticatedError;
