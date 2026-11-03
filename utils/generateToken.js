const jwt = require("jsonwebtoken");

class GenerateToken {

    static generateAccessToken(user) {
        return jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m"
            }
        );
    }

    static generateRefreshToken(user) {
        return jwt.sign(
            {
                id: user._id,
                type: "refresh"
            },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d"
            }
        );
    }
}

module.exports = GenerateToken;