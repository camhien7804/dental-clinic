// backend/middlewares/error.js
export const errorMiddleware = (err, req, res, next) => {
  // If err is not an Error object, make it one
  const e = err instanceof Error ? err : new Error(String(err));
  const statusCode = err?.statusCode || err?.status || 500;

  console.error("Unhandled error:", e.stack || e.message || e);

  const message = e.message || "Internal Server Error";

  // don't leak stack in production (you can enhance if needed)
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
