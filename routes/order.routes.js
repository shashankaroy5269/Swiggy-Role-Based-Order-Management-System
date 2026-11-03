const express = require("express");

const router = express.Router();

const orderController = require("../controllers/order.controller");

const AuthMiddleware = require("../middlewares/auth.middleware");
const RoleMiddleware = require("../middlewares/role.middleware");

const OrderValidation = require("../validations/order.validation");

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

// User Routes
router.post(
    "/",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("user"),
    validate(OrderValidation.createOrderSchema),
    orderController.createOrder
);

router.get(
    "/my-orders",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("user"),
    orderController.getMyOrders
);

router.get(
    "/my-orders/:id",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("user"),
    orderController.getOrderById
);

router.patch(
    "/:id/cancel",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("user"),
    validate(OrderValidation.cancelOrderSchema),
    orderController.cancelOrder
);

// Restaurant Owner Routes
router.get(
    "/restaurant",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("restaurantOwner"),
    orderController.getRestaurantOrders
);

router.patch(
    "/:id/status",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("restaurantOwner"),
    validate(OrderValidation.updateStatusSchema),
    orderController.updateOrderStatus
);

module.exports = router;