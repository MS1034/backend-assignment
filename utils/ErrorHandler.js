import AppError from "./CustomError.js";

export function routeNotFound (req,res,next)
{
    const err = new AppError(`Cannot find ${req.url} on the server`,404)
    next(err)
}

export function globalErrorHandler (err, req, res, next) {
    if (res.headersSent) {
      return next(err)
    }
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    res.status(err.statusCode).json({ message: err.message, status: err.statusCode })
}

export function funcErrorWraper(func) {
  return (req, res, next) => {
    try {
      func(req, res, next);
    } catch (error) {
      next(error); 
    }
  };
}
