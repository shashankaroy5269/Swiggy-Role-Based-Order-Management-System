const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const ApiError = require("../utils/ApiError");

const asyncHandler = require("../utils/asyncHandler");

class AuthMiddleware {

    // Verify Access Token
    static authenticate = asyncHandler(async (req, res, next) => {

        let token;

        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            throw new ApiError(401, "Access token required");
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user) {
            throw new ApiError(401, "User not found");
        }

        if (user.isBlocked || !user.isActive) {
            throw new ApiError(403, "Your account is blocked or inactive");
        }

        req.user = user;

        next();
    });
}

module.exports = AuthMiddleware;