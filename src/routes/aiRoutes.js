import express from "express";
import verifyToken from "../middleware/auth.js";
import { generatePlan } from "../controllers/aiController.js";

const router = express.Router();

router.post("/", verifyToken, generatePlan);

export default router;
