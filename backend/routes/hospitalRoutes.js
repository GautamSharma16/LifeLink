import express from "express";
import { createHospital, listHospitals } from "../controllers/hospitalController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("hospital", "admin"), createHospital);
router.get("/", protect, listHospitals);

export default router;
