import express from "express";
import {
  forgotPassword,
  forgotPasswordValidation,
  getMe,
  login,
  loginValidation,
  register,
  registerValidation,
  resetPassword,
  resetPasswordValidation,
  updateProfile,
  updateProfileValidation,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.post("/forgot-password", forgotPasswordValidation, validate, forgotPassword);
router.post("/reset-password/:token", resetPasswordValidation, validate, resetPassword);
router.get("/me", protect, getMe);
router.put("/me", protect, updateProfileValidation, validate, updateProfile);

export default router;
