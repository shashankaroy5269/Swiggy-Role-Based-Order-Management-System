const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");

const AuthValidation = require("../validations/auth.validation");

// Register
router.post(
    "/register",
    async (req, res, next) => {
        const { error } = AuthValidation.registerSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        next();
    },
    authController.register.bind(authController)
);

// Login
router.post(
    "/login",
    async (req, res, next) => {
        const { error } = AuthValidation.loginSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        next();
    },
    authController.login.bind(authController)
);

// Refresh Token
router.post(
    "/refresh-token",
    authController.refreshToken.bind(authController)
);

// Logout
router.post(
    "/logout",
    authController.logout.bind(authController)
);

module.exports = router;