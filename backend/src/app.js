require("dotenv").config();
const express = require("express");
<<<<<<< HEAD
const cors = require("cors");
=======
const cors = require('cors');
>>>>>>> c8ecfb7d101dbbeaf959ad4fd08ea16854b2087e
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const authMiddleware = require("./middleware/auth.middleware");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

<<<<<<< HEAD
// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
=======
app.use(cors());
>>>>>>> c8ecfb7d101dbbeaf959ad4fd08ea16854b2087e

// Connect DB
connectDB();

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
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
console.log("Attempting to listen on PORT:", PORT, "| type:", typeof PORT);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

