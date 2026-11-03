const User = require("../models/user.model");
const Restaurant = require("../models/restaurant.model");
const Order = require("../models/order.model");

const ApiError = require("../utils/ApiError");

class AdminService {

    // Get All Users
    async getAllUsers(query) {

        const {
            search,
            role,
            page = 1,
            limit = 10
        } = query;

        const filter = {};

        if (role) {
            filter.role = role;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const users = await User.find(filter)
            .select("-password")
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(filter);

        return {
            users,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }

    // Block User
    async blockUser(userId, adminId) {

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        if (user._id.toString() === adminId.toString()) {
            throw new ApiError(400, "You cannot block yourself");
        }

        if (user.role === "admin") {
            throw new ApiError(403, "Cannot block another admin");
        }

        user.isBlocked = true;

        await user.save();

        return user;
    }

    // Unblock User
    async unblockUser(userId) {

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        user.isBlocked = false;

        await user.save();

        return user;
    }

    // Get All Restaurants
    async getAllRestaurants(query) {

        const filter = {};

        if (query.search) {
            filter.name = {
                $regex: query.search,
                $options: "i"
            };
        }

        const restaurants = await Restaurant.find(filter)
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

        return restaurants;
    }

    // Get All Orders
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

    // Admin Manage Order
    async updateOrderStatus(orderId, status) {

        const order = await Order.findById(orderId);

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        const allowedStatuses = [
            "Pending",
            "Accepted",
            "Rejected",
            "Preparing",
            "Out for Delivery",
            "Delivered",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            throw new ApiError(400, "Invalid order status");
        }

        order.orderStatus = status;

        await order.save();

        return order;
    }

    // Dashboard Statistics
    async getStatistics() {

        const totalUsers = await User.countDocuments({
            role: "user"
        });

        const totalOwners = await User.countDocuments({
            role: "restaurantOwner"
        });

        const totalRestaurants = await Restaurant.countDocuments({
            isActive: true
        });

        const totalOrders = await Order.countDocuments();

        const pendingOrders = await Order.countDocuments({
            orderStatus: "Pending"
        });

        const deliveredOrders = await Order.countDocuments({
            orderStatus: "Delivered"
        });

        const rejectedOrders = await Order.countDocuments({
            orderStatus: "Rejected"
        });

        const revenueResult = await Order.aggregate([
            {
                $match: {
                    orderStatus: "Delivered"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalPrice"
                    }
                }
            }
        ]);

        const totalRevenue = revenueResult.length > 0
            ? revenueResult[0].totalRevenue
            : 0;

        return {
            totalUsers,
            totalOwners,
            totalRestaurants,
            totalOrders,
            pendingOrders,
            deliveredOrders,
            rejectedOrders,
            totalRevenue
        };
    }
}

module.exports = new AdminService();