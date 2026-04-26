import express from "express";
import User from "../models/User.js";
import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import verifyToken from "../middleware/auth.js";
import requireRole from "../middleware/role.js";

const router = express.Router();

// Admin stats
router.get("/stats", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingOrganizers = await User.countDocuments({
      role: "organizer",
      isVerified: false,
    });
    res.json({ totalUsers, totalEvents, totalBookings, pendingOrganizers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// Saare organizers dekho
router.get(
  "/organizers",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const organizers = await User.find({ role: "organizer" }).select(
        "-password",
      );
      res.json(organizers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching organizers" });
    }
  },
);

// Organizer verify karo
router.put(
  "/organizers/:userId/verify",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { isVerified: true },
        { new: true },
      ).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ message: "Organizer verified successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Error verifying organizer" });
    }
  },
);

// Organizer reject karo
router.put(
  "/organizers/:userId/reject",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { isVerified: false, isRejected: true },
        { new: true },
      ).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ message: "Organizer rejected", user });
    } catch (error) {
      res.status(500).json({ message: "Error rejecting organizer" });
    }
  },
);

// Saare events dekho (admin)
router.get("/events", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const events = await Event.find().populate("userId", "name email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
});

// Pending events dekho (admin) — verification ke liye
router.get(
  "/events/pending",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const events = await Event.find({
        isApproved: false,
        isRejected: false,
      }).populate("userId", "name email");
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending events" });
    }
  },
);

// Event approve karo (admin)
router.put(
  "/events/:id/approve",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const event = await Event.findByIdAndUpdate(
        req.params.id,
        { isApproved: true, isRejected: false },
        { new: true },
      );
      if (!event) return res.status(404).json({ message: "Event not found" });
      res.json({ message: "Event approved successfully", event });
    } catch (error) {
      res.status(500).json({ message: "Error approving event" });
    }
  },
);

// Event reject karo (admin)
router.put(
  "/events/:id/reject",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const event = await Event.findByIdAndUpdate(
        req.params.id,
        { isApproved: false, isRejected: true },
        { new: true },
      );
      if (!event) return res.status(404).json({ message: "Event not found" });
      res.json({ message: "Event rejected", event });
    } catch (error) {
      res.status(500).json({ message: "Error rejecting event" });
    }
  },
);

// Event delete karo (admin)
router.delete(
  "/events/:id",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      await Event.findByIdAndDelete(req.params.id);
      res.json({ message: "Event deleted by admin" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting event" });
    }
  },
);

// Saare users dekho
router.get("/users", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

export default router;
