const Joi = require("joi");

class RestaurantValidation {

    static createRestaurantSchema = Joi.object({

        name: Joi.string().min(3).max(100).required(),

        description: Joi.string().min(10).required(),

        address: Joi.object({
            street: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            pincode: Joi.string().required()
        }).required(),

        image: Joi.string().allow("").optional()
    });

    static updateRestaurantSchema = Joi.object({

        name: Joi.string().min(3).max(100),

        description: Joi.string().min(10),

        address: Joi.object({
            street: Joi.string(),
            city: Joi.string(),
            state: Joi.string(),
            pincode: Joi.string()
        }),

        image: Joi.string().allow(""),

        isOpen: Joi.boolean(),

        isActive: Joi.boolean()

    }).min(1);
}

module.exports = RestaurantValidation;