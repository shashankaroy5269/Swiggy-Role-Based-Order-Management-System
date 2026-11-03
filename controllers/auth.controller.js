const authService = require("../services/auth.service");

class AuthController {

    // Register
    async register(req, res) {
        try {

            const user = await authService.registerUser(req.body);

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: user
            });

        } catch (error) {

            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Login
    async login(req, res) {
        try {

            const result = await authService.loginUser(req.body);

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    user: result.user,
                    accessToken: result.accessToken
                }
            });

        } catch (error) {

            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    // Refresh Token
    async refreshToken(req, res) {
        try {

            const token = req.cookies.refreshToken;

            const result = await authService.refreshAccessToken(token);

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.status(200).json({
                success: true,
                message: "Token refreshed successfully",
                data: {
                    accessToken: result.accessToken
                }
            });

        } catch (error) {

            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    // Logout
    async logout(req, res) {
        try {

            await authService.logoutUser(req.cookies.refreshToken);

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            });

            res.status(200).json({
                success: true,
                message: "Logout successful"
            });

        } catch (error) {

            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new AuthController();