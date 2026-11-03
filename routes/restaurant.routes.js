const express = require("express");

const router = express.Router();

const restaurantController = require("../controllers/restaurant.controller");

const AuthMiddleware = require("../middlewares/auth.middleware");
const RoleMiddleware = require("../middlewares/role.middleware");
const OwnershipMiddleware = require("../middlewares/ownership.middleware");

const RestaurantValidation = require("../validations/restaurant.validation");

// Validation Middleware
const validate = (schema) => {
    return (req, res, next) => {

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        next();
    };
};

// Public Routes
router.get(
    "/",
    restaurantController.getAllRestaurants
);

router.get(
    "/:id",
    restaurantController.getRestaurantById
);

// Owner Routes
router.post(
    "/",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("restaurantOwner"),
    validate(RestaurantValidation.createRestaurantSchema),
    restaurantController.createRestaurant
);

router.get(
    "/my-restaurant",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("restaurantOwner"),
    restaurantController.getMyRestaurant
);

router.patch(
    "/:id",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("restaurantOwner"),
    OwnershipMiddleware.checkRestaurantOwnership,
    validate(RestaurantValidation.updateRestaurantSchema),
    restaurantController.updateRestaurant
);

router.delete(
    "/:id",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("restaurantOwner"),
    OwnershipMiddleware.checkRestaurantOwnership,
    restaurantController.deleteRestaurant
);

// Restaurant Open / Close
router.patch(
    "/:id/status",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("restaurantOwner"),
    OwnershipMiddleware.checkRestaurantOwnership,
    restaurantController.updateRestaurantStatus
);

module.exports = router;