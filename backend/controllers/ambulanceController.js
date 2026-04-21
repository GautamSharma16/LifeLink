import { body } from "express-validator";
import AmbulanceRequest from "../models/AmbulanceRequest.js";

export const ambulanceValidation = [
  body("pickupAddress").notEmpty(),
  body("hospitalDestination").notEmpty(),
  body("city").notEmpty(),
  body("patientCondition").notEmpty(),
];

export const createAmbulanceRequest = async (req, res, next) => {
  try {
    const request = await AmbulanceRequest.create({ ...req.body, requester: req.user._id });
    req.io.emit("ambulance_requested", request);
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

export const assignAmbulance = async (req, res, next) => {
  try {
    const request = await AmbulanceRequest.findByIdAndUpdate(
      req.params.id,
      { driver: req.user._id, status: "assigned" },
      { new: true }
    );
    req.io.emit("ambulance_assigned", request);
    res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

export const getAmbulanceRequests = async (req, res, next) => {
  try {
    const requests = await AmbulanceRequest.find().populate("requester driver", "name phone city");
    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};
