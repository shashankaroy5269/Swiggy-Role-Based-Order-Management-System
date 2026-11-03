const Joi = require("joi");

class FoodValidation {

    static createFoodSchema = Joi.object({

        name: Joi.string().min(2).max(100).required(),

        description: Joi.string().min(5).required(),

        price: Joi.number().min(1).required(),

        image: Joi.string().allow("").optional(),

        restaurant: Joi.string().hex().length(24).required(),

        category: Joi.string().hex().length(24).required(),

        foodType: Joi.string()
            .valid("veg", "non-veg")
            .required(),

        isAvailable: Joi.boolean().optional()
    });

    static updateFoodSchema = Joi.object({

        name: Joi.string().min(2).max(100),

        description: Joi.string().min(5),

        price: Joi.number().min(1),

        image: Joi.string().allow(""),

        category: Joi.string().hex().length(24),

        foodType: Joi.string().valid("veg", "non-veg"),

        isAvailable: Joi.boolean()

    }).min(1);
}

module.exports = FoodValidation;
