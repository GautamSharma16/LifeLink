import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true, index: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    bedsAvailable: { type: Number, default: 0 },
    icuAvailable: { type: Number, default: 0 },
    oxygenAvailable: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    ownerUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Hospital", hospitalSchema);
