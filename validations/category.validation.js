const Joi = require("joi");

class CategoryValidation {

    static createSchema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        description: Joi.string().allow("").optional(),
        image: Joi.string().allow("").optional()
    });

    static updateSchema = Joi.object({
        name: Joi.string().min(2).max(50),
        description: Joi.string().allow(""),
        image: Joi.string().allow("")
    }).min(1);
}

module.exports = CategoryValidation;