const cartService = require("../services/cart.service");

const ApiResponse = require("../utils/ApiResponse");

const asyncHandler = require("../utils/asyncHandler");

class CartController {

    // Add To Cart
    addToCart = asyncHandler(async (req, res) => {

        const { foodId, quantity } = req.body;

        const cart = await cartService.addToCart(
            req.user._id,
            foodId,
            quantity
        );

        res.status(200).json(
            new ApiResponse(200, "Food added to cart", cart)
        );
    });

    // Get Cart
    getCart = asyncHandler(async (req, res) => {

        const cart = await cartService.getCart(req.user._id);

        res.status(200).json(
            new ApiResponse(200, "Cart fetched successfully", cart)
        );
    });

    // Update Quantity
    updateCart = asyncHandler(async (req, res) => {

        const cart = await cartService.updateCart(
            req.user._id,
            req.params.foodId,
            req.body.quantity
        );

        res.status(200).json(
            new ApiResponse(200, "Cart updated successfully", cart)
        );
    });

    // Remove Item
    removeCartItem = asyncHandler(async (req, res) => {

        const cart = await cartService.removeCartItem(
            req.user._id,
            req.params.foodId
        );

        res.status(200).json(
            new ApiResponse(200, "Food removed from cart", cart)
        );
    });

    // Clear Cart
    clearCart = asyncHandler(async (req, res) => {

        await cartService.clearCart(req.user._id);

        res.status(200).json(
            new ApiResponse(200, "Cart cleared successfully")
        );
    });
}

module.exports = new CartController();