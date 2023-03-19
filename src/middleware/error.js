const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  let str = err.toString().split("\n")[0];
  let seekString = "Error:";
  var idx = str.indexOf(seekString);
  let text = str.substring(idx + seekString.length, str.length);

  if (err.code === 11000) {
    const message = `Duplicate Field value entered`;
    error = new ErrorResponse(message, 400);
  }

  if (err.statusCode === 4001) {
    const message = `Database not found`;
    error = new ErrorResponse(message, 4001);
  }

  if (err.statusCode === 4002) {
    const message = `Database model not found`;
    error = new ErrorResponse(message, 4002);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 406);
  }

  let errorObject = {
    success: false,
    error: error.message || "Server Error",
  };

  //console.log("errorHandler", errorObject);

  res.status(error.statusCode || 500).json(errorObject);
};

module.exports = errorHandler;
