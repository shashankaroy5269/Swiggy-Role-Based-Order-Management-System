const ApiError = require("../utils/ApiError");

class AdminSecretMiddleware {

    static verifySecretKey(req, res, next) {

        const secretKey = req.headers["x-admin-secret"];

        if (!secretKey) {
            return next(
                new ApiError(401, "Admin secret key required")
            );
        }

        if (secretKey !== process.env.ADMIN_SECRET_KEY) {
            return next(
                new ApiError(403, "Invalid admin secret key")
            );
        }

        next();
    }
}

module.exports = AdminSecretMiddleware;