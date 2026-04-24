import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createCamp, getCamps, joinCamp } from "../controllers/campController.js";

const router = express.Router();

router.post("/", protect, createCamp);
router.get("/", protect, getCamps);
router.post("/:id/join", protect, joinCamp);

export default router;
