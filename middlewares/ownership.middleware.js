const Restaurant = require("../models/restaurant.model");

const ApiError = require("../utils/ApiError");

const asyncHandler = require("../utils/asyncHandler");

class OwnershipMiddleware {

    static checkRestaurantOwnership = asyncHandler(
        async (req, res, next) => {

            const restaurantId = req.params.id;

            const restaurant = await Restaurant.findById(
                restaurantId
            );

            if (!restaurant) {
                throw new ApiError(404, "Restaurant not found");
            }

            if (
                restaurant.owner.toString() !==
                req.user._id.toString()
            ) {
                throw new ApiError(
                    403,
                    "You cannot access another owner's restaurant"
                );
            }

            req.restaurant = restaurant;

            next();
        }
    );
}

module.exports = OwnershipMiddleware;