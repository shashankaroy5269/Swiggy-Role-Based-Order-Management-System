const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin.controller");

const AuthMiddleware = require("../middlewares/auth.middleware");

const RoleMiddleware = require("../middlewares/role.middleware");

const AdminSecretMiddleware = require("../middlewares/adminSecret.middleware");

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

// All Admin Routes Security
router.use(
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("admin"),
    AdminSecretMiddleware.verifySecretKey
);

// Dashboard
router.get(
    "/statistics",
    adminController.getStatistics
);

// User Management
router.get(
    "/users",
    adminController.getAllUsers
);

router.patch(
    "/users/:id/block",
    adminController.blockUser
);

router.patch(
    "/users/:id/unblock",
    adminController.unblockUser
);

// Restaurant Management
router.get(
    "/restaurants",
    adminController.getAllRestaurants
);

// Order Management
router.get(
    "/orders",
    adminController.getAllOrders
);

router.patch(
    "/orders/:id/status",
    validate(OrderValidation.updateStatusSchema),
    adminController.updateOrderStatus
);

module.exports = router;