export default class AppError extends Error {
  constructor(message, status = 500, cause = null) {
    super(message);
    this.status = status;
    this.cause = cause;
  }
}
