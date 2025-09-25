export class AppError extends Error {
  constructor( status = 400,message, details) {
    super(message); this.success = false; this.status = status; this.details = details }
}

export function notFound(_req, _res, next) {
  next(new AppError(404, false, "Not found"));
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    details: err.details
  });
}

export function errorMiddleware(err, _req, res, _next) {
  const status = err.status || 500
  const payload = { message: err.message || 'Unexpected error' }
  if (err.details) payload.details = err.details
  if (process.env.NODE_ENV !== 'production' && err.stack) payload.stack = err.stack
  res.status(status).json(payload)
}

export const unprocessable = (msg, details) => new AppError(msg, false, 400, details)
