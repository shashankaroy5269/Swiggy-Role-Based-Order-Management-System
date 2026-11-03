const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        address: {
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

        image: {
            type: String,
            default: ""
        },

        isOpen: {
            type: Boolean,
            default: true
        },

        isActive: {
            type: Boolean,
            default: true
        },

        averageRating: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

restaurantSchema.index({
    name: "text",
    description: "text"
});

const Restaurant = mongoose.model(
    "Restaurant",
    restaurantSchema
);

module.exports = Restaurant;