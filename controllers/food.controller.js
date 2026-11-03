const foodService = require("../services/food.service");

const ApiResponse = require("../utils/ApiResponse");

const asyncHandler = require("../utils/asyncHandler");

class FoodController {

    // Add Food
    createFood = asyncHandler(async (req, res) => {

        const food = await foodService.createFood(
            req.body,
            req.user._id
        );

        res.status(201).json(
            new ApiResponse(
                201,
                "Food added successfully",
                food
            )
        );
    });

    // Get All Foods
    getAllFoods = asyncHandler(async (req, res) => {

        const result = await foodService.getAllFoods(req.query);

        res.status(200).json(
            new ApiResponse(
                200,
                "Foods fetched successfully",
                result
            )
        );
    });

    // Get Single Food
    getFoodById = asyncHandler(async (req, res) => {

        const food = await foodService.getFoodById(req.params.id);

        res.status(200).json(
            new ApiResponse(
                200,
                "Food fetched successfully",
                food
            )
        );
    });

    // Get Restaurant Foods
    getRestaurantFoods = asyncHandler(async (req, res) => {

        const foods = await foodService.getRestaurantFoods(
            req.params.restaurantId
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Restaurant foods fetched successfully",
                foods
            )
        );
    });

    // Update Food
    updateFood = asyncHandler(async (req, res) => {

        const food = await foodService.updateFood(
            req.params.id,
            req.body,
            req.user._id
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Food updated successfully",
                food
            )
        );
    });

    // Delete Food
    deleteFood = asyncHandler(async (req, res) => {

        await foodService.deleteFood(
            req.params.id,
            req.user._id
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Food deleted successfully"
            )
        );
    });

    // Update Food Availability
    updateFoodAvailability = asyncHandler(async (req, res) => {

        const food = await foodService.updateFoodAvailability(
            req.params.id,
            req.body.isAvailable,
            req.user._id
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Food availability updated successfully",
                food
            )
        );
    });
}

module.exports = new FoodController();