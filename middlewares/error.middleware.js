const ApiError = require("../utils/ApiError");

class ErrorMiddleware {

    // Handle Not Found Routes
    static notFound(req, res, next) {

        const error = new ApiError(
            404,
            `Route not found: ${req.originalUrl}`
        );

        next(error);
    }

    // Global Error Handler
    static errorHandler(err, req, res, next) {

        let statusCode = err.statusCode || 500;

        let message = err.message || "Internal Server Error";

        // MongoDB Invalid ObjectId
        if (err.name === "CastError") {
            statusCode = 400;
            message = "Invalid ID";
        }

        // Duplicate Key Error
        if (err.code === 11000) {
            statusCode = 409;
            message = "Already exists";
        }

        // JWT Errors
        if (err.name === "JsonWebTokenError") {
            statusCode = 401;
            message = "Invalid token";
        }

        if (err.name === "TokenExpiredError") {
            statusCode = 401;
            message = "Token expired";
        }

        res.status(statusCode).json({
            success: false,
            message,
            ...(process.env.NODE_ENV === "development" && {
                stack: err.stack
            })
        });
    }
}

module.exports = ErrorMiddleware;