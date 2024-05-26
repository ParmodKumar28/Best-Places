// middleware/errorMiddleware.js
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandlerMiddleware = (err, req, res, next) => {
  // Log the error here first for better approach
  console.log(err);
  err.message = err.message || "Internal server error!";
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};

export { notFound, errorHandlerMiddleware };
