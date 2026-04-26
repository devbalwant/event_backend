import Event from "../models/Event.js";

// Get user events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.userId });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
};

// Public events
export const getPublicEvents = async (req, res) => {
  try {
    const events = await Event.find({
      isApproved: true,
      isPublic: true,
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching public events" });
  }
};

// Single event
export const getSingleEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event" });
  }
};

// Create event
export const createEvent = async (req, res) => {
  try {
    const newEvent = new Event({
      ...req.body,
      userId: req.user.userId,
    });

    const savedEvent = await newEvent.save();

    res.json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error saving event" });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    req.body.isApproved = false;
    req.body.isRejected = false;

    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      req.body,
      { new: true },
    );

    if (!updatedEvent) {
      return res.status(404).json({
        message: "Event not found or unauthorized",
      });
    }

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error updating event" });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Event not found or unauthorized",
      });
    }

    res.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event" });
  }
};
