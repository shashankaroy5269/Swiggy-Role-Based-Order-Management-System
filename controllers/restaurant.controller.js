const restaurantService = require("../services/restaurant.service");

const ApiResponse = require("../utils/ApiResponse");

const asyncHandler = require("../utils/asyncHandler");

class RestaurantController {

    // Create Restaurant
    createRestaurant = asyncHandler(async (req, res) => {

        const restaurant = await restaurantService.createRestaurant(
            req.body,
            req.user._id
        );

        res.status(201).json(
            new ApiResponse(
                201,
                "Restaurant created successfully",
                restaurant
            )
        );
    });

    // Get All Restaurants
    getAllRestaurants = asyncHandler(async (req, res) => {

        const result = await restaurantService.getAllRestaurants(
            req.query
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Restaurants fetched successfully",
                result
            )
        );
    });

    // Get Single Restaurant
    getRestaurantById = asyncHandler(async (req, res) => {

        const restaurant = await restaurantService.getRestaurantById(
            req.params.id
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Restaurant fetched successfully",
                restaurant
            )
        );
    });

    // Get My Restaurant
    getMyRestaurant = asyncHandler(async (req, res) => {

        const restaurant = await restaurantService.getMyRestaurant(
            req.user._id
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Your restaurant fetched successfully",
                restaurant
            )
        );
    });

    // Update Restaurant
    updateRestaurant = asyncHandler(async (req, res) => {

        const restaurant = await restaurantService.updateRestaurant(
            req.params.id,
            req.body,
            req.user._id
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Restaurant updated successfully",
                restaurant
            )
        );
    });

    // Delete Restaurant
    deleteRestaurant = asyncHandler(async (req, res) => {

        await restaurantService.deleteRestaurant(
            req.params.id,
            req.user._id
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Restaurant deleted successfully"
            )
        );
    });

    // Update Restaurant Status
    updateRestaurantStatus = asyncHandler(async (req, res) => {

        const restaurant = await restaurantService.updateRestaurantStatus(
            req.params.id,
            req.body.isOpen,
            req.user._id
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Restaurant status updated successfully",
                restaurant
            )
        );
    });
}

module.exports = new RestaurantController();