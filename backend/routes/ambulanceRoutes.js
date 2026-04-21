import express from "express";
import {
  ambulanceValidation,
  assignAmbulance,
  createAmbulanceRequest,
  getAmbulanceRequests,
} from "../controllers/ambulanceController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/", protect, ambulanceValidation, validate, createAmbulanceRequest);
router.get("/", protect, getAmbulanceRequests);
router.patch("/:id/assign", protect, authorize("ambulance_driver", "admin"), assignAmbulance);

export default router;
