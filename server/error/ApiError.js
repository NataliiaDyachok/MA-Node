class ApiError extends Error{
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }

    static badRequest(message) {
        return new ApiError(404, message);
    }

    static internal(message) {
        return new ApiError(500, message);
    }

    static forbidden(message) {
        return new ApiError(403, message);
    }

    static authenticationRequired(message) {
        return new ApiError(401, message);
    }

    static notImplemented(message) {
      return new ApiError(501, message);
  }

    static fatal(message) {
      console.error(message);
      process.exit(1);
    }
}

module.exports = ApiError;
