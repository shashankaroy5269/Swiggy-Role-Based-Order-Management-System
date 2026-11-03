const ApiError = require("../utils/ApiError");

class RoleMiddleware {

    static authorize = (...roles) => {

        return (req, res, next) => {

            if (!req.user) {
                return next(
                    new ApiError(401, "Authentication required")
                );
            }

            if (!roles.includes(req.user.role)) {
                return next(
                    new ApiError(403, "You are not authorized")
                );
            }

            next();
        };
    };
}

module.exports = RoleMiddleware;