const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const examRoutes = require("./routes/examRoutes");
const resultRoutes = require("./routes/resultRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/examDB";
mongoose.connect(mongoURI)
    .then(() => console.log("✓ MongoDB Connected"))
    .catch(err => console.error("✗ MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", examRoutes);
app.use("/api", resultRoutes);

// Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Online Examination System Backend Running",
        status: "healthy",
        timestamp: new Date()
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
