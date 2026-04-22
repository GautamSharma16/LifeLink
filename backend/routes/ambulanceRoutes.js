import express from "express";
import { protect } from "../middlewares/auth.js";
import { 
  createAmbulanceRequest, 
  getAmbulanceRequests, 
  acceptAmbulanceRequest, 
  updateAmbulanceStatus 
} from "../controllers/ambulanceController.js";

const router = express.Router();

router.post("/", protect, createAmbulanceRequest);
router.get("/", protect, getAmbulanceRequests);
router.put("/:id/accept", protect, acceptAmbulanceRequest);
router.put("/:id/status", protect, updateAmbulanceStatus);

export default router;
