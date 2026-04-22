import VolunteerRequest from "../models/VolunteerRequest.js";
import User from "../models/User.js";

export const createVolunteerRequest = async (req, res, next) => {
  try {
    const request = await VolunteerRequest.create({ ...req.body, requester: req.user._id });
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

export const acceptVolunteerRequest = async (req, res, next) => {
  try {
    const request = await VolunteerRequest.findByIdAndUpdate(
      req.params.id,
      { volunteer: req.user._id, status: "accepted" },
      { new: true }
    );
    res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

export const listVolunteerRequests = async (req, res, next) => {
  try {
    const { city } = req.query;
    const requests = await VolunteerRequest.find({ ...(city && { city }) });
    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

export const listVolunteers = async (req, res, next) => {
  try {
    const { city } = req.query;
    const filter = { role: "volunteer" };
    if (city) filter.city = city;
    const volunteers = await User.find(filter).select("-password -__v");
    res.json({ success: true, data: volunteers });
  } catch (error) {
    next(error);
  }
};

export const joinVolunteerNetwork = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { role: "volunteer" },
      { new: true }
    );
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
