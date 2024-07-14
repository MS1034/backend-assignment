export default class AppError extends Error
{
    constructor(message, statusCode)
    {
        super(message)

        this.statusCode = statusCode
        this.status = statusCode>= 400 && statusCode <500? 'fail' : 'error'
        this.isOptional = true

        Error.captureStackTrace(this, this.constructor)
    }
}