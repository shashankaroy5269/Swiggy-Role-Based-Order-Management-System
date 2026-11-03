const Food = require("../models/food.model");

const Restaurant = require("../models/restaurant.model");

const Category = require("../models/category.model");

const ApiError = require("../utils/ApiError");

class FoodService {

    // Add Food
    async createFood(data, ownerId) {

        const restaurant = await Restaurant.findOne({
            _id: data.restaurant,
            owner: ownerId,
            isActive: true
        });

        if (!restaurant) {
            throw new ApiError(
                403,
                "Restaurant not found or access denied"
            );
        }

        const category = await Category.findOne({
            _id: data.category,
            isActive: true
        });

        if (!category) {
            throw new ApiError(404, "Category not found");
        }

        const food = await Food.create(data);

        return food;
    }

    // Get All Foods
    async getAllFoods(query) {

        const {
            search,
            category,
            foodType,
            minPrice,
            maxPrice,
            restaurant,
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

        if (category) {
            filter.category = category;
        }

        if (restaurant) {
            filter.restaurant = restaurant;
        }

        if (foodType) {
            filter.foodType = foodType;
        }

        if (minPrice || maxPrice) {

            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        const skip = (Number(page) - 1) * Number(limit);

        const foods = await Food.find(filter)
            .populate("restaurant", "name address isOpen")
            .populate("category", "name")
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Food.countDocuments(filter);

        return {
            foods,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }

    // Get Single Food
    async getFoodById(id) {

        const food = await Food.findOne({
            _id: id,
            isActive: true
        })
            .populate("restaurant", "name address isOpen")
            .populate("category", "name");

        if (!food) {
            throw new ApiError(404, "Food not found");
        }

        return food;
    }

    // Get Restaurant Foods
    async getRestaurantFoods(restaurantId) {

        const restaurant = await Restaurant.findOne({
            _id: restaurantId,
            isActive: true
        });

        if (!restaurant) {
            throw new ApiError(404, "Restaurant not found");
        }

        const foods = await Food.find({
            restaurant: restaurantId,
            isActive: true
        }).populate("category", "name");

        return foods;
    }

    // Update Food
    async updateFood(id, data, ownerId) {

        const food = await Food.findOne({
            _id: id,
            isActive: true
        }).populate("restaurant");

        if (!food) {
            throw new ApiError(404, "Food not found");
        }

        if (
            food.restaurant.owner.toString() !== ownerId.toString()
        ) {
            throw new ApiError(403, "Access denied");
        }

        if (data.category) {

            const category = await Category.findOne({
                _id: data.category,
                isActive: true
            });

            if (!category) {
                throw new ApiError(404, "Category not found");
            }
        }

        Object.assign(food, data);

        await food.save();

        return food;
    }

    // Delete Food
    async deleteFood(id, ownerId) {

        const food = await Food.findOne({
            _id: id,
            isActive: true
        }).populate("restaurant");

        if (!food) {
            throw new ApiError(404, "Food not found");
        }

        if (
            food.restaurant.owner.toString() !== ownerId.toString()
        ) {
            throw new ApiError(403, "Access denied");
        }

        food.isActive = false;

        await food.save();

        return true;
    }

    // Update Food Availability
    async updateFoodAvailability(id, isAvailable, ownerId) {

        const food = await Food.findOne({
            _id: id,
            isActive: true
        }).populate("restaurant");

        if (!food) {
            throw new ApiError(404, "Food not found");
        }

        if (
            food.restaurant.owner.toString() !== ownerId.toString()
        ) {
            throw new ApiError(403, "Access denied");
        }

        food.isAvailable = isAvailable;

        await food.save();

        return food;
    }
}

module.exports = new FoodService();