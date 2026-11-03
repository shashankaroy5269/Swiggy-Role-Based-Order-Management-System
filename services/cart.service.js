const Cart = require("../models/cart.model");
const Food = require("../models/food.model");
const Restaurant = require("../models/restaurant.model");

const ApiError = require("../utils/ApiError");

class CartService {

    // Add Food To Cart
    async addToCart(userId, foodId, quantity = 1) {

        const food = await Food.findOne({
            _id: foodId,
            isActive: true,
            isAvailable: true
        });

        if (!food) {
            throw new ApiError(404, "Food not available");
        }

        const restaurant = await Restaurant.findOne({
            _id: food.restaurant,
            isActive: true,
            isOpen: true
        });

        if (!restaurant) {
            throw new ApiError(400, "Restaurant is currently closed");
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                restaurant: food.restaurant,
                items: []
            });
        }

        // Check restaurant
        if (
            cart.restaurant &&
            cart.restaurant.toString() !== food.restaurant.toString()
        ) {
            throw new ApiError(
                409,
                "Your cart contains food from another restaurant. Clear your cart first."
            );
        }

        const existingItem = cart.items.find(
            item => item.food.toString() === foodId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                food: foodId,
                quantity
            });
        }

        cart.restaurant = food.restaurant;

        await cart.save();

        return this.getCart(userId);
    }

    // Get Cart
    async getCart(userId) {

        const cart = await Cart.findOne({
            user: userId
        })
            .populate({
                path: "restaurant",
                select: "name image isOpen"
            })
            .populate({
                path: "items.food",
                select: "name price image foodType isAvailable isActive"
            });

        if (!cart) {
            return {
                items: [],
                restaurant: null,
                totalItems: 0,
                totalPrice: 0
            };
        }

        let totalPrice = 0;
        let totalItems = 0;

        const items = cart.items.map(item => {

            const food = item.food;

            const price = food && food.isActive ? food.price : 0;

            const subtotal = price * item.quantity;

            totalPrice += subtotal;
            totalItems += item.quantity;

            return {
                food,
                quantity: item.quantity,
                price,
                subtotal
            };
        });

        return {
            _id: cart._id,
            restaurant: cart.restaurant,
            items,
            totalItems,
            totalPrice
        };
    }

    // Update Cart Quantity
    async updateCart(userId, foodId, quantity) {

        const cart = await Cart.findOne({
            user: userId
        });

        if (!cart) {
            throw new ApiError(404, "Cart not found");
        }

        const item = cart.items.find(
            item => item.food.toString() === foodId
        );

        if (!item) {
            throw new ApiError(404, "Food not found in cart");
        }

        const food = await Food.findOne({
            _id: foodId,
            isActive: true,
            isAvailable: true
        });

        if (!food) {
            throw new ApiError(400, "Food is no longer available");
        }

        item.quantity = quantity;

        await cart.save();

        return this.getCart(userId);
    }

    // Remove Cart Item
    async removeCartItem(userId, foodId) {

        const cart = await Cart.findOne({
            user: userId
        });

        if (!cart) {
            throw new ApiError(404, "Cart not found");
        }

        cart.items = cart.items.filter(
            item => item.food.toString() !== foodId
        );

        if (cart.items.length === 0) {
            cart.restaurant = null;
        }

        await cart.save();

        return this.getCart(userId);
    }

    // Clear Cart
    async clearCart(userId) {

        const cart = await Cart.findOne({
            user: userId
        });

        if (!cart) {
            return true;
        }

        cart.items = [];
        cart.restaurant = null;

        await cart.save();

        return true;
    }
}

module.exports = new CartService();