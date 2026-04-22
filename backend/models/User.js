import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, minlength: 6, select: false },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    role: {
      type: String,
      enum: ["user", "volunteer", "hospital", "ambulance_driver", "admin"],
      default: "user",
      index: true,
    },
    // Hospital Specific
    hospitalName: { type: String },
    availableBeds: { type: Number, default: 0 },
    icuBeds: { type: Number, default: 0 },
    oxygenCylinders: { type: Number, default: 0 },
    // Ambulance Specific
    vehicleNumber: { type: String },
    isAvailable: { type: Boolean, default: true },
    
    avatar: { type: String, default: "" },
    achievements: [{ type: String }],
    isBanned: { type: Boolean, default: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
