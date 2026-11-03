const express = require("express");

const router = express.Router();

const cartController = require("../controllers/cart.controller");

const AuthMiddleware = require("../middlewares/auth.middleware");
const RoleMiddleware = require("../middlewares/role.middleware");

const CartValidation = require("../validations/cart.validation");

const validate = (schema) => {

    return (req, res, next) => {

        const { error, value } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        req.body = value;

        next();
    };
};

// All Cart Routes Require User Login
router.use(
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("user")
);

// Get Cart
router.get(
    "/",
    cartController.getCart
);

// Add Food
router.post(
    "/add",
    validate(CartValidation.addToCartSchema),
    cartController.addToCart
);

// Update Quantity
router.patch(
    "/update/:foodId",
    validate(CartValidation.updateCartSchema),
    cartController.updateCart
);

// Remove Food
router.delete(
    "/remove/:foodId",
    cartController.removeCartItem
);

// Clear Cart
router.delete(
    "/clear",
    cartController.clearCart
);

module.exports = router;