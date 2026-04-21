import Hospital from "../models/Hospital.js";
import User from "../models/User.js";

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const banUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const verifyHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    res.json({ success: true, data: hospital });
  } catch (error) {
    next(error);
  }
};
