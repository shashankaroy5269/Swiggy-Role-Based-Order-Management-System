require("dotenv").config();

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const User = require("../models/user.model");

const Database = require("../config/db");

const createAdmin = async () => {

    try {

        await Database.connectDB();

        const adminEmail = process.env.ADMIN_EMAIL;

        const adminPassword = process.env.ADMIN_PASSWORD;

        const adminName = process.env.ADMIN_NAME;

        if (!adminEmail || !adminPassword || !adminName) {
            throw new Error("Admin environment variables are required");
        }

        const hashedPassword = await bcrypt.hash(
            adminPassword,
            10
        );

        const admin = await User.findOneAndUpdate(
            { email: adminEmail },
            {
                $set: {
                    name: adminName,
                    email: adminEmail,
                    password: hashedPassword,
                    phone: "9999999999",
                    role: "admin",
                    isBlocked: false,
                    isActive: true
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        console.log("Admin created successfully:", admin.email);

        await mongoose.connection.close();

        process.exit(0);

    } catch (error) {

        console.log("Admin creation failed:", error.message);

        await mongoose.connection.close();

        process.exit(1);
    }
};

createAdmin();