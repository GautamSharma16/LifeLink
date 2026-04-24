import express from "express";
import { createHospital, getMyHospital, listHospitals, registerHospital } from "../controllers/hospitalController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, listHospitals);
router.get("/me", protect, authorize("hospital"), getMyHospital);
router.post("/register", protect, authorize("hospital"), registerHospital);
router.put("/register", protect, authorize("hospital"), createHospital);

export default router;
