import express from "express";
import {
  acceptBloodRequest,
  bloodRequestValidation,
  completeBloodRequest,
  createBloodRequest,
  getBloodRequests,
} from "../controllers/bloodController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/", protect, bloodRequestValidation, validate, createBloodRequest);
router.get("/", protect, getBloodRequests);
router.patch("/:id/accept", protect, authorize("user", "volunteer"), acceptBloodRequest);
router.patch("/:id/complete", protect, authorize("user", "volunteer", "admin"), completeBloodRequest);

export default router;