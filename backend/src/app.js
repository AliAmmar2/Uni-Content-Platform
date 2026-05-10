require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const adminAuthRoutes = require("./routes/admin-auth.routes");
const adminRoutes = require("./routes/admin.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const facultyRoutes = require("./routes/faculty.routes");
const majorRoutes = require("./routes/major.routes");
const courseRoutes = require("./routes/course.routes");
const materialRoutes = require("./routes/material.routes");
const studentRoutes = require("./routes/students.routes");

const authMiddleware = require("./middleware/student-auth.middleware");

const app = express();

// =========================
// Middleware
// =========================
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// =========================
// Database Connection
// =========================
connectDB();

// =========================
// Routes
// =========================
// =========================

app.get("/health", (req, res) => {
    res.json({status: "OK", timestamp: new Date().toISOString()});
});

app.use("/students", studentRoutes);
app.use("/admin", adminAuthRoutes);
app.use("/admins", adminRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/faculties", facultyRoutes);
app.use("/majors", majorRoutes);
app.use("/courses", courseRoutes);
app.use("/materials", materialRoutes);

// =========================
// Protected Test Route
// =========================
app.get("/protected/test", authMiddleware, (req, res) => {
    res.json({message: "Protected route works"});
});

// =========================
// 404 Handler
// =========================
app.use((req, res) => {
    res.status(404).json({message: "Route not found"});
});

// =========================
// Global Error Handler
// =========================
app.use((err, req, res, next) => {
    console.error("ERROR:", err);

    res.status(500).json({
        message: "Internal server error",
        ...(process.env.NODE_ENV === "development" && {error: err.message})
    });
});

// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});