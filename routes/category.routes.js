const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");
const RoleMiddleware = require("../middlewares/role.middleware");
const CategoryValidation = require("../validations/category.validation");
const AdminSecretMiddleware = require("../middlewares/adminSecret.middleware");

const validate = (schema) => {
    return (req, res, next) => {

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        next();
    };
};

// Public: View Categories
router.get(
    "/",
    categoryController.getAllCategories
);

router.get(
    "/:id",
    categoryController.getCategoryById
);

// Admin: Create Category
router.post(
    "/",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("admin"),
    AdminSecretMiddleware.verifySecretKey,
    validate(CategoryValidation.createSchema),
    categoryController.createCategory
);

// Admin: Update Category
router.patch(
    "/:id",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("admin"),
    AdminSecretMiddleware.verifySecretKey,
    validate(CategoryValidation.updateSchema),
    categoryController.updateCategory
);

// Admin: Delete Category
router.delete(
    "/:id",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize("admin"),
    AdminSecretMiddleware.verifySecretKey,
    categoryController.deleteCategory
);

module.exports = router;