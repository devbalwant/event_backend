import express from "express";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Attendee — event book karo
router.post("/", verifyToken, async (req, res) => {
  try {
    const { eventId } = req.body;

    // Check karo event exist karta hai
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Free event book nahi ho sakta
    if (event.ticketPrice === 0) {
      return res.status(400).json({ message: "Free events cannot be booked" });
    }

    // Check karo pehle se book toh nahi kiya
    const existing = await Booking.findOne({
      eventId,
      userId: req.user.userId,
    });
    if (existing) {
      return res.status(400).json({ message: "Already booked this event" });
    }

    const booking = new Booking({ eventId, userId: req.user.userId });
    await booking.save();

    res.json({
      message: "Event booked successfully!",
      passCode: booking.passCode,
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error booking event" });
  }
});

// Attendee — apni saari bookings dekho
router.get("/my", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId }).populate(
      "eventId",
    );
    res.json(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// Organizer — apne event ki bookings dekho
router.get("/event/:eventId", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({
      eventId: req.params.eventId,
    }).populate("userId", "name email");
    res.json(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching event bookings" });
  }
});

// Attendee — booking cancel karo
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Booking.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!deleted)
      return res
        .status(404)
        .json({ message: "Booking not found or unauthorized" });
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling booking" });
  }
});

export default router;
