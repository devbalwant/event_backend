import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "organizer", "attendee"], default: "attendee" },
  isVerified: { type: Boolean, default: false }, // organizer ko admin verify karega
  isRejected: { type: Boolean, default: false }, // admin ne reject kiya
});

const User = mongoose.model("User", userSchema);

export default User;
