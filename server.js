require("dotenv").config();

const app = require("./app");
const Database = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {

        await Database.connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.log("Server Error:", error.message);
        process.exit(1);
    }
};

startServer();