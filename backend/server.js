const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const profileRoutes = require("./routes/profileRoutes");
const disciplineRoutes = require("./routes/disciplineRoutes");

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Middleware
const rawClientUrls = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((u) => u.trim())
  : [];
const allowedOrigins = [
  ...rawClientUrls,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/+$/, "");
    const isAllowed = allowedOrigins.some(
      (allowed) => allowed.replace(/\/+$/, "") === normalizedOrigin
    );
    if (isAllowed || process.env.NODE_ENV !== "production") {
      callback(null, true);
    } else {
      callback(new Error(`CORS origin not allowed: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/disciplines", disciplineRoutes);

// Root health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ArjuVisuals API is running successfully"
  });
});

// 404 handler for unknown endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found"
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal server error" : (err.message || "Internal server error")
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});