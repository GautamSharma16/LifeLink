import express from "express";
import { banUser, listUsers, verifyHospital } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/users", listUsers);
router.patch("/users/:id/ban", banUser);
router.patch("/hospitals/:id/verify", verifyHospital);

export default router;
