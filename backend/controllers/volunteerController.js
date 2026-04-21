import VolunteerRequest from "../models/VolunteerRequest.js";

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
