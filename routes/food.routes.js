const express = require("express");

const router = express.Router();

const foodController = require("../controllers/food.controller");

const AuthMiddleware = require("../middlewares/auth.middleware");

const RoleMiddleware = require("../middlewares/role.middleware");

const FoodValidation = require("../validations/food.validation");

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
    foodController.getAllFoods
);

router.get(
    "/restaurant/:restaurantId",
    foodController.getRestaurantFoods
);

router.get(
    "/:id",
    foodController.getFoodById
);

// Owner Routes
router.post(
    "/",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("restaurantOwner"),
    validate(FoodValidation.createFoodSchema),
    foodController.createFood
);

router.patch(
    "/:id",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("restaurantOwner"),
    validate(FoodValidation.updateFoodSchema),
    foodController.updateFood
);

router.delete(
    "/:id",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("restaurantOwner"),
    foodController.deleteFood
);

router.patch(
    "/:id/availability",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("restaurantOwner"),
    foodController.updateFoodAvailability
);

module.exports = router;