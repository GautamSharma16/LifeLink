import mongoose from "mongoose";

const donationCampSchema = new mongoose.Schema(
  {
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true, index: true },
    volunteersNeeded: { type: Number, default: 0 },
    volunteersJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["scheduled", "ongoing", "completed", "cancelled"], default: "scheduled" },
  },
  { timestamps: true }
);

export default mongoose.model("DonationCamp", donationCampSchema);
