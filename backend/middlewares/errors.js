const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Specific Mongoose Errors
  if (err.name === "CastError") {
    message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "ValidationError") {
    message = Object.values(err.errors).map((value) => value.message);
    err = new ErrorHandler(message, 400);
  }

  if (err.code === 11000) {
    message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    message = "JSON Web Token is invalid. Try again!!!";
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    message = "JSON Web Token is expired. Try again!!!";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "DEVELOPMENT" ? err.stack : undefined,
  });
};
