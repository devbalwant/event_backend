import express from "express";

import {
  getEvents,
  getPublicEvents,
  getSingleEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import verifyToken from "../middleware/auth.js";
import requireRole from "../middleware/role.js";

const router = express.Router();

router.get("/", verifyToken, getEvents);

router.get("/public", getPublicEvents);

router.get("/:id", verifyToken, getSingleEvent);

router.post("/", verifyToken, requireRole("organizer", "admin"), createEvent);

router.put("/:id", verifyToken, updateEvent);

router.delete("/:id", verifyToken, deleteEvent);

export default router;
