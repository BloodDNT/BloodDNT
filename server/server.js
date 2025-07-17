const express = require("express");
const cors = require("cors");
const donationRoutes = require("./routes/donationRoutes");
const healthRoutes = require("./routes/healthRoutes");
const historyRoutes = require("./routes/historyRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const userRoutes = require("./routes/userRoutes");
const initialHealthRoutes = require("./routes/initialHealthRoutes");
const bloodDonationRoutes = require("./routes/bloodDonationRoutes");

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Mount routes with appropriate prefixes
app.use("/api/don-dang-ky", donationRoutes);
app.use("/api/kiem-tra-suc-khoe", healthRoutes);
app.use("/api/lich-su-hien-mau", historyRoutes);
app.use("/api/kho-mau", inventoryRoutes); // Mount inventory routes
app.use("/api/users", userRoutes);
app.use("/api/initial-health", initialHealthRoutes);
app.use("/api/blood-donation", bloodDonationRoutes);

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ error: "Lỗi server nội bộ" });
});

// Check if routes are loaded correctly
console.log("Routes loaded:", {
  donation: donationRoutes ? donationRoutes.stack : "Not loaded",
  health: healthRoutes ? healthRoutes.stack : "Not loaded",
  history: historyRoutes ? historyRoutes.stack : "Not loaded",
  inventory: inventoryRoutes ? inventoryRoutes.stack : "Not loaded",
  users: userRoutes ? userRoutes.stack : "Not loaded",
  initialHealth: initialHealthRoutes ? initialHealthRoutes.stack : "Not loaded",
  bloodDonation: bloodDonationRoutes ? bloodDonationRoutes.stack : "Not loaded",
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server chạy trên cổng ${PORT}`);
});
