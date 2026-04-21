import { body } from "express-validator";
import BloodRequest from "../models/BloodRequest.js";
import DonationHistory from "../models/DonationHistory.js";
import Notification from "../models/Notification.js";

export const bloodRequestValidation = [
  body("patientName").notEmpty(),
  body("bloodGroup").notEmpty(),
  body("units").isInt({ min: 1 }),
  body("hospitalName").notEmpty(),
  body("city").notEmpty(),
];

export const createBloodRequest = async (req, res, next) => {
  try {
    const bloodRequest = await BloodRequest.create({ ...req.body, requester: req.user._id });
    req.io.emit("blood_request_created", bloodRequest);
    return res.status(201).json({ success: true, data: bloodRequest });
  } catch (error) {
    next(error);
  }
};

export const getBloodRequests = async (req, res, next) => {
  try {
    const { city, bloodGroup, status } = req.query;
    const filter = { ...(city && { city }), ...(bloodGroup && { bloodGroup }), ...(status && { status }) };
    const requests = await BloodRequest.find(filter).populate("requester donor", "name city bloodGroup");
    return res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

export const acceptBloodRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { donor: req.user._id, status: "accepted" },
      { new: true }
    );
    await Notification.create({
      user: request.requester,
      title: "Blood request accepted",
      message: `Your request was accepted by ${req.user.name}.`,
      type: "blood",
    });
    req.io.emit("blood_request_accepted", request);
    return res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

export const completeBloodRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    request.status = "completed";
    await request.save();

    await DonationHistory.create({
      donor: request.donor,
      bloodRequest: request._id,
      unitsDonated: request.units,
      city: request.city,
    });
    return res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};
