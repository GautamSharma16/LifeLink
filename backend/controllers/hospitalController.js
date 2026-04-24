import User from "../models/User.js";

export const createHospital = async (req, res, next) => {
  try {
    // Legacy support or remove
    res.status(201).json({ success: true, message: "Use profile update instead" });
  } catch (error) {
    next(error);
  }
};

export const listHospitals = async (req, res, next) => {
  try {
    const { city } = req.query;
    const filter = { role: "hospital", ...(city && { city }) };
    const hospitals = await User.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: hospitals });
  } catch (error) {
    next(error);
  }
};
