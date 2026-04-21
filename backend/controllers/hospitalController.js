import Hospital from "../models/Hospital.js";

export const createHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.create({ ...req.body, ownerUser: req.user._id });
    res.status(201).json({ success: true, data: hospital });
  } catch (error) {
    next(error);
  }
};

export const listHospitals = async (req, res, next) => {
  try {
    const { city } = req.query;
    const hospitals = await Hospital.find({ ...(city && { city }) }).sort({ verified: -1, createdAt: -1 });
    res.json({ success: true, data: hospitals });
  } catch (error) {
    next(error);
  }
};
