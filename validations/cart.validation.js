const Joi = require("joi");

class CartValidation {

    static addToCartSchema = Joi.object({
        foodId: Joi.string().hex().length(24).required(),
        quantity: Joi.number().integer().min(1).default(1)
    });

    static updateCartSchema = Joi.object({
        quantity: Joi.number().integer().min(1).required()
    });
}

module.exports = CartValidation;