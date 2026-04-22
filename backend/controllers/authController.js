import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const registerValidation = [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("phone").notEmpty(),
  body("address").notEmpty(),
  body("city").notEmpty(),
];

export const loginValidation = [body("email").isEmail(), body("password").notEmpty()];
export const forgotPasswordValidation = [body("email").isEmail()];
export const resetPasswordValidation = [body("password").isLength({ min: 6 })];
export const updateProfileValidation = [
  body("name").optional().notEmpty(),
  body("phone").optional().notEmpty(),
  body("address").optional().notEmpty(),
  body("city").optional().notEmpty(),
  body("bloodGroup")
    .optional()
    .isIn(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
];

export const register = async (req, res, next) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return res.status(409).json({ success: false, message: "Email already in use" });

    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hashed });
    return res.status(201).json({ success: true, message: "Registration successful", data: user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select("+password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isBanned) return res.status(403).json({ success: false, message: "Account is banned" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({
      success: true,
      message: "Login successful",
      data: { token, user: { ...user.toObject(), password: undefined } },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select("+resetPasswordToken +resetPasswordExpires");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // In production send email with `${CLIENT_URL}/reset-password/${rawToken}`
    return res.json({
      success: true,
      message: "Password reset link generated",
      data: { resetToken: rawToken },
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires +password");

    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updates = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      bloodGroup: req.body.bloodGroup,
      hospitalName: req.body.hospitalName,
      availableBeds: req.body.availableBeds,
      icuBeds: req.body.icuBeds,
      oxygenCylinders: req.body.oxygenCylinders,
      vehicleNumber: req.body.vehicleNumber,
    };

    if (req.body.avatarFile) {
      const uploadResult = await cloudinary.uploader.upload(req.body.avatarFile, {
        folder: "lifelink/avatars",
        resource_type: "image",
      });
      updates.avatar = uploadResult.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      Object.fromEntries(Object.entries(updates).filter(([, value]) => value !== undefined && value !== "")),
      { new: true, runValidators: true }
    );

    return res.json({ success: true, message: "Profile updated successfully", data: user });
  } catch (error) {
    next(error);
  }
};
