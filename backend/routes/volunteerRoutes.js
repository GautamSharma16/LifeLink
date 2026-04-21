import express from "express";
import {
  acceptVolunteerRequest,
  createVolunteerRequest,
  listVolunteerRequests,
} from "../controllers/volunteerController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createVolunteerRequest);
router.get("/", protect, listVolunteerRequests);
router.patch("/:id/accept", protect, authorize("volunteer", "admin"), acceptVolunteerRequest);

export default router;
