import mongoose from "mongoose";

const donationHistorySchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bloodRequest: { type: mongoose.Schema.Types.ObjectId, ref: "BloodRequest", required: true },
    unitsDonated: { type: Number, required: true },
    city: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("DonationHistory", donationHistorySchema);
