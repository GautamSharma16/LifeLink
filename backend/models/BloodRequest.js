import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    patientName: { type: String, required: true },
    bloodGroup: { type: String, required: true, index: true },
    units: { type: Number, required: true, min: 1 },
    hospitalName: { type: String, required: true },
    city: { type: String, required: true, index: true },
    status: { type: String, enum: ["open", "accepted", "completed", "cancelled"], default: "open" },
    emergencyLevel: { type: String, enum: ["low", "medium", "critical"], default: "medium" },
  },
  { timestamps: true }
);

export default mongoose.model("BloodRequest", bloodRequestSchema);
