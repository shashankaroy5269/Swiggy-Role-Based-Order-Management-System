const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");

const GenerateToken = require("../utils/generateToken");

class AuthService {

    // Register User
    async registerUser(data) {

        const { name, email, phone, password, role } = data;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role: role || "user"
        });

        return user;
    }

    // Login User
    async loginUser(data) {

        const { email, password } = data;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            throw new Error("Invalid email or password");
        }

        if (user.isBlocked || !user.isActive) {
            throw new Error("Your account is blocked or inactive");
        }

        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            throw new Error("Invalid email or password");
        }

        const accessToken = GenerateToken.generateAccessToken(user);

        const refreshToken = GenerateToken.generateRefreshToken(user);

        const hashedRefreshToken = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        const decoded = require("jsonwebtoken").decode(refreshToken);

        await RefreshToken.create({
            user: user._id,
            token: hashedRefreshToken,
            expiresAt: new Date(decoded.exp * 1000)
        });

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        };
    }

    // Refresh Access Token
    async refreshAccessToken(token) {

        const jwt = require("jsonwebtoken");

        if (!token) {
            throw new Error("Refresh token is required");
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET
        );

        if (decoded.type !== "refresh") {
            throw new Error("Invalid refresh token");
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const savedToken = await RefreshToken.findOne({
            user: decoded.id,
            token: hashedToken
        });

        if (!savedToken) {
            throw new Error("Refresh token revoked or invalid");
        }

        const user = await User.findById(decoded.id);

        if (!user || user.isBlocked || !user.isActive) {
            throw new Error("User not available");
        }

        // Rotate refresh token
        await RefreshToken.deleteOne({ _id: savedToken._id });

        const accessToken = GenerateToken.generateAccessToken(user);

        const newRefreshToken = GenerateToken.generateRefreshToken(user);

        const newDecoded = jwt.decode(newRefreshToken);

        const newHashedToken = crypto
            .createHash("sha256")
            .update(newRefreshToken)
            .digest("hex");

        await RefreshToken.create({
            user: user._id,
            token: newHashedToken,
            expiresAt: new Date(newDecoded.exp * 1000)
        });

        return {
            accessToken,
            refreshToken: newRefreshToken
        };
    }

    // Logout User
    async logoutUser(token) {

        if (!token) {
            throw new Error("Refresh token is required");
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        await RefreshToken.deleteOne({
            token: hashedToken
        });

        return true;
    }
}

module.exports = new AuthService();