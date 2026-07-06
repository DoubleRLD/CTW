// Custom error class so controllers can throw with an intentional
// status code instead of always producing generic 500s.
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Wraps async route handlers so a rejected promise (e.g. a failed
// DB query) is forwarded to Express's error handling instead of
// crashing the process or hanging the request.
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Must be registered LAST in app.js, after all routes.
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  // MySQL constraint violations (CHECK, UNIQUE, FK) come through as
  // specific error codes — translate the common ones into friendly
  // 400s instead of leaking raw SQL errors to the frontend.
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'A record with these values already exists.' });
  }
  if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED' || err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ error: 'Invalid data submitted.' });
  }

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({ error: err.message || 'Something went wrong.' });
}
