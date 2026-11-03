const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            unique: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
        },

        items: [
            {
                food: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Food",
                    required: true
                },

                name: {
                    type: String,
                    required: true
                },

                price: {
                    type: Number,
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true
                },

                subtotal: {
                    type: Number,
                    required: true
                }
            }
        ],

        deliveryAddress: {
            street: {
                type: String,
                required: true
            },

            city: {
                type: String,
                required: true
            },

            state: {
                type: String,
                required: true
            },

            pincode: {
                type: String,
                required: true
            }
        },

        totalItems: {
            type: Number,
            required: true
        },

        totalPrice: {
            type: Number,
            required: true
        },

        orderStatus: {
            type: String,
            enum: [
                "Pending",
                "Accepted",
                "Rejected",
                "Preparing",
                "Out for Delivery",
                "Delivered",
                "Cancelled"
            ],
            default: "Pending"
        },

        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        cancelReason: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

orderSchema.index({
    user: 1,
    createdAt: -1
});

orderSchema.index({
    restaurant: 1,
    orderStatus: 1
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;