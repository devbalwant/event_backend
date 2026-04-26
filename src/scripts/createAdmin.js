import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

await mongoose.connect("mongodb://balwant01:balwantChauhan@ac-g6kqxdl-shard-00-00.0hflmmj.mongodb.net:27017,ac-g6kqxdl-shard-00-01.0hflmmj.mongodb.net:27017,ac-g6kqxdl-shard-00-02.0hflmmj.mongodb.net:27017/?ssl=true&replicaSet=atlas-9on1bg-shard-0&authSource=admin&appName=Cluster0");

const existing = await User.findOne({ email: "admin@eventpro.com" });
if (existing) {
  console.log("Admin already exists!");
  process.exit(0);
}

const hashedPassword = await bcrypt.hash("admin123", 10);
await User.create({
  name: "Admin",
  email: "admin@eventpro.com",
  password: hashedPassword,
  role: "admin",
  isVerified: true,
});

console.log("✅ Admin created!");
console.log("Email: admin@eventpro.com");
console.log("Password: admin123");
process.exit(0);
