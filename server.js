import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // ← sabse pehle — taaki sab env variables load ho jayein

import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/auth.js";
import bookingRoutes from "./src/routes/bookings.js";
import adminRoutes from "./src/routes/admin.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/plan", aiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
