import mongoose from "mongoose";

const ambulanceRequestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pickupAddress: { type: String, required: true },
    hospitalDestination: { type: String, required: true },
    city: { type: String, required: true, index: true },
    patientCondition: { type: String, required: true },
    status: { type: String, enum: ["pending", "assigned", "arrived", "completed"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("AmbulanceRequest", ambulanceRequestSchema);
