require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const facultyRoutes = require("./routes/faculty.routes");
const majorRoutes = require("./routes/major.routes");
const courseRoutes = require("./routes/course.routes");
const materialRoutes = require("./routes/material.routes");

const authMiddleware = require("./middleware/auth.middleware");

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
connectDB();

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/faculties", facultyRoutes);
app.use("/majors", majorRoutes);
app.use("/courses", courseRoutes);
app.use("/materials", materialRoutes);

// test route
app.get("/protected/test", authMiddleware, (req, res) => {
  res.json({ message: "Protected route works" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: err.message })
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));