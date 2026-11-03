const adminService = require("../services/admin.service");

const ApiResponse = require("../utils/ApiResponse");

const asyncHandler = require("../utils/asyncHandler");

class AdminController {

    // Get All Users
    getAllUsers = asyncHandler(async (req, res) => {

        const result = await adminService.getAllUsers(req.query);

        res.status(200).json(
            new ApiResponse(
                200,
                "Users fetched successfully",
                result
            )
        );
    });

    // Block User
    blockUser = asyncHandler(async (req, res) => {

        const user = await adminService.blockUser(
            req.params.id,
            req.user._id
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "User blocked successfully",
                user
            )
        );
    });

    // Unblock User
    unblockUser = asyncHandler(async (req, res) => {

        const user = await adminService.unblockUser(
            req.params.id
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "User unblocked successfully",
                user
            )
        );
    });

    // Get All Restaurants
    getAllRestaurants = asyncHandler(async (req, res) => {

        const restaurants = await adminService.getAllRestaurants(
            req.query
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "All restaurants fetched successfully",
                restaurants
            )
        );
    });

    // Get All Orders
    getAllOrders = asyncHandler(async (req, res) => {

        const orders = await adminService.getAllOrders(
            req.query
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "All orders fetched successfully",
                orders
            )
        );
    });

    // Manage Order
    updateOrderStatus = asyncHandler(async (req, res) => {

        const order = await adminService.updateOrderStatus(
            req.params.id,
            req.body.status
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Order updated successfully",
                order
            )
        );
    });

    // Dashboard Statistics
    getStatistics = asyncHandler(async (req, res) => {

        const statistics = await adminService.getStatistics();

        res.status(200).json(
            new ApiResponse(
                200,
                "Statistics fetched successfully",
                statistics
            )
        );
    });
}

module.exports = new AdminController();