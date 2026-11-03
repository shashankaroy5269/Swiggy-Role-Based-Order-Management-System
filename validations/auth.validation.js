const Joi = require("joi");

class AuthValidation {

    static registerSchema = Joi.object({
        name: Joi.string().min(3).max(50).required(),

        email: Joi.string().email().required(),

        phone: Joi.string()
            .pattern(/^[0-9]{10}$/)
            .required(),

        password: Joi.string().min(6).required(),

        role: Joi.string()
            .valid("user", "restaurantOwner")
            .optional()
    });

    static loginSchema = Joi.object({
        email: Joi.string().email().required(),

        password: Joi.string().required()
    });
}

module.exports = AuthValidation;