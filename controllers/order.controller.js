const orderService = require("../services/order.service");

const ApiResponse = require("../utils/ApiResponse");

const asyncHandler = require("../utils/asyncHandler");

class OrderController {

    // Create Order
    createOrder = asyncHandler(async (req, res) => {

        const order = await orderService.createOrder(
            req.user._id,
            req.body.deliveryAddress
        );

        res.status(201).json(
            new ApiResponse(
                201,
                "Order placed successfully",
                order
            )
        );
    });

    // Get My Orders
    getMyOrders = asyncHandler(async (req, res) => {

        const orders = await orderService.getMyOrders(
            req.user._id
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Your orders fetched successfully",
                orders
            )
        );
    });

    // Get Single Order
    getOrderById = asyncHandler(async (req, res) => {

        const order = await orderService.getOrderById(
            req.params.id,
            req.user._id
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Order fetched successfully",
                order
            )
        );
    });

    // Restaurant Orders
    getRestaurantOrders = asyncHandler(async (req, res) => {

        const orders = await orderService.getRestaurantOrders(
            req.user._id,
            req.query
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Restaurant orders fetched successfully",
                orders
            )
        );
    });

    // Update Order Status
    updateOrderStatus = asyncHandler(async (req, res) => {

        const order = await orderService.updateOrderStatus(
            req.params.id,
            req.user._id,
            req.body.status
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Order status updated successfully",
                order
            )
        );
    });

    // Cancel Order
    cancelOrder = asyncHandler(async (req, res) => {

        const order = await orderService.cancelOrder(
            req.params.id,
            req.user._id,
            req.body.reason
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Order cancelled successfully",
                order
            )
        );
    });

    // Admin: All Orders
    getAllOrders = asyncHandler(async (req, res) => {

        const orders = await orderService.getAllOrders(
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
}

module.exports = new OrderController();