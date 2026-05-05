const errorHandler = (error, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, error.stack);

  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message || "Internal Server Error";

  res.status(statusCode).json({
    status,
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

module.exports = errorHandler;
