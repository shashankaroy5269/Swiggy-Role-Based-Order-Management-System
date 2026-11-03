const mongoose = require("mongoose");

const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Food = require("../models/food.model");
const Restaurant = require("../models/restaurant.model");

const ApiError = require("../utils/ApiError");

class OrderService {

    // Create Order
    async createOrder(userId, deliveryAddress) {

        const session = await mongoose.startSession();

        let createdOrder;

        try {

            await session.withTransaction(async () => {

                const cart = await Cart.findOne({
                    user: userId
                }).session(session);

                if (!cart || cart.items.length === 0) {
                    throw new ApiError(400, "Your cart is empty");
                }

                const restaurant = await Restaurant.findOne({
                    _id: cart.restaurant,
                    isActive: true,
                    isOpen: true
                }).session(session);

                if (!restaurant) {
                    throw new ApiError(400, "Restaurant is closed");
                }

                let totalPrice = 0;
                let totalItems = 0;
                const orderItems = [];

                for (const item of cart.items) {

                    const food = await Food.findOne({
                        _id: item.food,
                        restaurant: restaurant._id,
                        isActive: true,
                        isAvailable: true
                    }).session(session);

                    if (!food) {
                        throw new ApiError(
                            400,
                            "One or more food items are unavailable"
                        );
                    }

                    const subtotal = food.price * item.quantity;

                    totalPrice += subtotal;
                    totalItems += item.quantity;

                    orderItems.push({
                        food: food._id,
                        name: food.name,
                        price: food.price,
                        quantity: item.quantity,
                        subtotal
                    });
                }

                const order = new Order({
                    orderNumber: `SWG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    user: userId,
                    restaurant: restaurant._id,
                    items: orderItems,
                    deliveryAddress,
                    totalItems,
                    totalPrice,
                    orderStatus: "Pending"
                });

                await order.save({ session });

                cart.items = [];
                cart.restaurant = null;

                await cart.save({ session });

                createdOrder = order;
            });

            return createdOrder;

        } finally {

            await session.endSession();
        }
    }

    // Get User Orders
    async getMyOrders(userId) {

        const orders = await Order.find({
            user: userId
        })
            .populate("restaurant", "name image")
            .sort({ createdAt: -1 });

        return orders;
    }

    // Get Single Order
    async getOrderById(orderId, userId) {

        const order = await Order.findOne({
            _id: orderId,
            user: userId
        })
            .populate("restaurant", "name address")
            .populate("items.food", "name image");

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        return order;
    }

    // Get Restaurant Orders
   async getRestaurantOrders(ownerId, query) {

    const restaurants = await Restaurant.find({
        owner: ownerId,
        isActive: true
    }).select("_id");

    if (restaurants.length === 0) {
        throw new ApiError(404, "No restaurants found");
    }

    const restaurantIds = restaurants.map(
        restaurant => restaurant._id
    );

    const filter = {
        restaurant: { $in: restaurantIds }
    };

    if (query.status) {
        filter.orderStatus = query.status;
    }

    const orders = await Order.find(filter)
        .populate("user", "name email phone")
        .populate("restaurant", "name")
        .sort({ createdAt: -1 });

    return orders;
}

    // Update Order Status
    async updateOrderStatus(orderId, ownerId, status) {

        const order = await Order.findById(orderId);

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        const restaurant = await Restaurant.findOne({
            _id: order.restaurant,
            owner: ownerId,
            isActive: true
        });

        if (!restaurant) {
            throw new ApiError(403, "You cannot manage this order");
        }

        const allowedTransitions = {
            Pending: ["Accepted", "Rejected"],
            Accepted: ["Preparing"],
            Preparing: ["Out for Delivery"],
            "Out for Delivery": ["Delivered"]
        };

        const allowedStatuses = allowedTransitions[order.orderStatus] || [];

        if (!allowedStatuses.includes(status)) {
            throw new ApiError(
                400,
                `Cannot change status from ${order.orderStatus} to ${status}`
            );
        }

        order.orderStatus = status;

        await order.save();

        return order;
    }

    // Cancel User Order
    async cancelOrder(orderId, userId, reason) {

        const order = await Order.findOne({
            _id: orderId,
            user: userId
        });

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        if (order.orderStatus !== "Pending") {
            throw new ApiError(
                400,
                "Only pending orders can be cancelled"
            );
        }

        order.orderStatus = "Cancelled";
        order.cancelledBy = userId;
        order.cancelReason = reason || "Cancelled by user";

        await order.save();

        return order;
    }

    // Admin: View All Orders
    async getAllOrders(query) {

        const filter = {};

        if (query.status) {
            filter.orderStatus = query.status;
        }

        const orders = await Order.find(filter)
            .populate("user", "name email")
            .populate("restaurant", "name")
            .sort({ createdAt: -1 });

        return orders;
    }
}

module.exports = new OrderService();