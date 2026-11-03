const Restaurant = require("../models/restaurant.model");

const ApiError = require("../utils/ApiError");

class RestaurantService {

    // Create Restaurant
    async createRestaurant(data, ownerId) {

        const existingRestaurant = await Restaurant.findOne({
            owner: ownerId,
            isActive: true
        });

        if (existingRestaurant) {
            throw new ApiError(
                409,
                "You already have an active restaurant"
            );
        }

        const restaurant = await Restaurant.create({
            ...data,
            owner: ownerId
        });

        return restaurant;
    }

    // Get All Restaurants
    async getAllRestaurants(query) {

        const {
            search,
            city,
            isOpen,
            page = 1,
            limit = 10
        } = query;

        const filter = {
            isActive: true
        };

        if (search) {
            filter.$text = {
                $search: search
            };
        }

        if (city) {
            filter["address.city"] = {
                $regex: city,
                $options: "i"
            };
        }

        if (isOpen !== undefined) {
            filter.isOpen = isOpen === "true";
        }

        const skip = (Number(page) - 1) * Number(limit);

        const restaurants = await Restaurant.find(filter)
            .populate("owner", "name email")
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Restaurant.countDocuments(filter);

        return {
            restaurants,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }

    // Get Single Restaurant
    async getRestaurantById(id) {

        const restaurant = await Restaurant.findOne({
            _id: id,
            isActive: true
        }).populate("owner", "name email");

        if (!restaurant) {
            throw new ApiError(404, "Restaurant not found");
        }

        return restaurant;
    }

    // Update Restaurant
    async updateRestaurant(id, data, ownerId) {

        const restaurant = await Restaurant.findById(id);

        if (!restaurant || !restaurant.isActive) {
            throw new ApiError(404, "Restaurant not found");
        }

        if (restaurant.owner.toString() !== ownerId.toString()) {
            throw new ApiError(403, "Access denied");
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            id,
            { $set: data },
            {
                new: true,
                runValidators: true
            }
        );

        return updatedRestaurant;
    }

    // Delete Restaurant
    async deleteRestaurant(id, ownerId) {

        const restaurant = await Restaurant.findById(id);

        if (!restaurant || !restaurant.isActive) {
            throw new ApiError(404, "Restaurant not found");
        }

        if (restaurant.owner.toString() !== ownerId.toString()) {
            throw new ApiError(403, "Access denied");
        }

        restaurant.isActive = false;

        await restaurant.save();

        return true;
    }

    // Change Restaurant Status
    async updateRestaurantStatus(id, isOpen, ownerId) {

        const restaurant = await Restaurant.findById(id);

        if (!restaurant || !restaurant.isActive) {
            throw new ApiError(404, "Restaurant not found");
        }

        if (restaurant.owner.toString() !== ownerId.toString()) {
            throw new ApiError(403, "Access denied");
        }

        restaurant.isOpen = isOpen;

        await restaurant.save();

        return restaurant;
    }

    // Get Owner Restaurant
    async getMyRestaurant(ownerId) {

        const restaurant = await Restaurant.findOne({
            owner: ownerId,
            isActive: true
        });

        if (!restaurant) {
            throw new ApiError(404, "Restaurant not found");
        }

        return restaurant;
    }
}

module.exports = new RestaurantService();