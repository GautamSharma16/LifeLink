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
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "volunteer", "hospital", "ambulance_driver", "admin"],
      default: "user",
      index: true,
    },
    avatar: { type: String, default: "" },
    achievements: [{ type: String }],
    isBanned: { type: Boolean, default: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
