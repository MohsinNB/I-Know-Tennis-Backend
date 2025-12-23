export class CustomError extends Error {
  public statusCode: number;
  public status: "client Error" | "server Error";
  public isOperationalError: boolean;
  public data: any;

  constructor(statusCode: number, message: string, data: any = null) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);

    this.statusCode = statusCode;
    this.data = data;

    this.status =
      statusCode >= 400 && statusCode < 500 ? "client Error" : "server Error";

    this.isOperationalError = !(statusCode >= 400 && statusCode < 500);

    // Captures the stack trace, excluding the constructor from the trace
    Error.captureStackTrace(this, this.constructor);
  }
}
