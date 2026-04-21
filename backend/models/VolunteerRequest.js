import mongoose from "mongoose";

const volunteerRequestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    city: { type: String, required: true, index: true },
    supportType: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["open", "accepted", "completed"], default: "open" },
  },
  { timestamps: true }
);

export default mongoose.model("VolunteerRequest", volunteerRequestSchema);
