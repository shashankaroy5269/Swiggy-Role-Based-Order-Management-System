const Category = require("../models/category.model");

const ApiError = require("../utils/ApiError");

class CategoryService {

    // Create Category
    async createCategory(data) {

        const existingCategory = await Category.findOne({
            name: data.name
        });

        if (existingCategory) {
            throw new ApiError(409, "Category already exists");
        }

        const category = await Category.create(data);

        return category;
    }

    // Get All Categories
    async getAllCategories() {

        const categories = await Category.find({
            isActive: true
        }).sort({ name: 1 });

        return categories;
    }

    // Get Single Category
    async getCategoryById(id) {

        const category = await Category.findOne({
            _id: id,
            isActive: true
        });

        if (!category) {
            throw new ApiError(404, "Category not found");
        }

        return category;
    }

    // Update Category
    async updateCategory(id, data) {

        const category = await Category.findOne({
            _id: id,
            isActive: true
        });

        if (!category) {
            throw new ApiError(404, "Category not found");
        }

        if (data.name) {
            const existing = await Category.findOne({
                name: data.name,
                _id: { $ne: id }
            });

            if (existing) {
                throw new ApiError(409, "Category name already exists");
            }
        }

        Object.assign(category, data);

        await category.save();

        return category;
    }

    // Delete Category
    async deleteCategory(id) {

        const category = await Category.findOne({
            _id: id,
            isActive: true
        });

        if (!category) {
            throw new ApiError(404, "Category not found");
        }

        category.isActive = false;

        await category.save();

        return true;
    }
}

module.exports = new CategoryService();