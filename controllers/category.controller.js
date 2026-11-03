const categoryService = require("../services/category.service");

const ApiResponse = require("../utils/ApiResponse");

const asyncHandler = require("../utils/asyncHandler");

class CategoryController {

    // Create Category
    createCategory = asyncHandler(async (req, res) => {

        const category = await categoryService.createCategory(req.body);

        res.status(201).json(
            new ApiResponse(201, "Category created successfully", category)
        );
    });

    // Get All Categories
    getAllCategories = asyncHandler(async (req, res) => {

        const categories = await categoryService.getAllCategories();

        res.status(200).json(
            new ApiResponse(200, "Categories fetched successfully", categories)
        );
    });

    // Get Single Category
    getCategoryById = asyncHandler(async (req, res) => {

        const category = await categoryService.getCategoryById(req.params.id);

        res.status(200).json(
            new ApiResponse(200, "Category fetched successfully", category)
        );
    });

    // Update Category
    updateCategory = asyncHandler(async (req, res) => {

        const category = await categoryService.updateCategory(
            req.params.id,
            req.body
        );

        res.status(200).json(
            new ApiResponse(200, "Category updated successfully", category)
        );
    });

    // Delete Category
    deleteCategory = asyncHandler(async (req, res) => {

        await categoryService.deleteCategory(req.params.id);

        res.status(200).json(
            new ApiResponse(200, "Category deleted successfully")
        );
    });
}

module.exports = new CategoryController();