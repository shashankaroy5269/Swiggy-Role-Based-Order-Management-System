const Joi = require("joi");

class OrderValidation {

    static createOrderSchema = Joi.object({

        deliveryAddress: Joi.object({
            street: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            pincode: Joi.string().required()
        }).required()
    });

    static updateStatusSchema = Joi.object({

        status: Joi.string()
            .valid(
                "Accepted",
                "Rejected",
                "Preparing",
                "Out for Delivery",
                "Delivered"
            )
            .required()
    });

    static cancelOrderSchema = Joi.object({

        reason: Joi.string().max(300).allow("").optional()
    });
}

module.exports = OrderValidation;