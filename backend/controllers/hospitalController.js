import User from "../models/User.js";
import Notification from "../models/Notification.js";

const hospitalProjection = [
  "name",
  "email",
  "phone",
  "address",
  "city",
  "hospitalName",
  "hospitalDescription",
  "hospitalRegistrationNumber",
  "hospitalVerified",
  "hospitalRegisteredAt",
  "availableBeds",
  "icuBeds",
  "oxygenCylinders",
  "emergencyContact",
  "createdAt",
].join(" ");

export const registerHospital = async (req, res, next) => {
  try {
    const updates = {
      role: "hospital",
      hospitalName: req.body.hospitalName,
      hospitalDescription: req.body.hospitalDescription,
      hospitalRegistrationNumber: req.body.hospitalRegistrationNumber,
      address: req.body.address,
      city: req.body.city,
      phone: req.body.phone,
      availableBeds: req.body.availableBeds,
      icuBeds: req.body.icuBeds,
      oxygenCylinders: req.body.oxygenCylinders,
      emergencyContact: req.body.emergencyContact,
      hospitalRegisteredAt: new Date(),
    };

    const hospitalUser = await User.findByIdAndUpdate(
      req.user._id,
      Object.fromEntries(
        Object.entries(updates).filter(([, value]) => value !== undefined && value !== "")
      ),
      { new: true, runValidators: true }
    ).select(hospitalProjection);

    const admins = await User.find({ role: "admin" }).select("_id");
    if (admins.length) {
      await Notification.insertMany(
        admins.map((admin) => ({
          user: admin._id,
          title: "New hospital registration",
          message: `${hospitalUser.hospitalName || hospitalUser.name} submitted a hospital profile for review.`,
          type: "hospital",
        }))
      );
    }

    return res.status(201).json({
      success: true,
      message: "Hospital profile submitted successfully",
      data: hospitalUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyHospital = async (req, res, next) => {
  try {
    const hospital = await User.findById(req.user._id).select(hospitalProjection);
    return res.json({ success: true, data: hospital });
  } catch (error) {
    next(error);
  }
};

export const createHospital = async (req, res, next) => {
  try {
    return registerHospital(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const listHospitals = async (req, res, next) => {
  try {
    const { city, verified } = req.query;
    const filter = { role: "hospital", ...(city && { city }) };

    if (verified === "true") filter.hospitalVerified = true;
    if (verified === "false") filter.hospitalVerified = false;

    const hospitals = await User.find(filter)
      .select(hospitalProjection)
      .sort({ hospitalVerified: -1, createdAt: -1 });

    res.json({ success: true, data: hospitals });
  } catch (error) {
    next(error);
  }
};
