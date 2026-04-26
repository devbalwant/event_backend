import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  location: String,
  budget: Number,
  date: String,
  status: String,
  category: { type: String, default: "general" },
  capacity: { type: Number, default: 0 },
  ticketPrice: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true },
  time: { type: String, default: "" },
  image: { type: String, default: "" },
  isApproved: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
