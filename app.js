const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const ErrorMiddleware = require("./middlewares/error.middleware");
const restaurantRoutes = require("./routes/restaurant.routes");
const categoryRoutes = require("./routes/category.routes");
const foodRoutes = require("./routes/food.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");






const app = express();

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// Test Route
app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Swiggy Clone API is Running"
    });
});

// Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);



app.use("/api/foods", foodRoutes);

// Not Found Middleware
app.use(ErrorMiddleware.notFound);

// Global Error Handler
app.use(ErrorMiddleware.errorHandler);

module.exports = app;