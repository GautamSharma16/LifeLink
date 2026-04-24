import VolunteerRequest from "../models/VolunteerRequest.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const createVolunteerRequest = async (req, res, next) => {
  try {
    const request = await VolunteerRequest.create({
      ...req.body,
      requester: req.user._id,
      city: req.body.city || req.user.city,
    });

    const volunteers = await User.find({
      role: "volunteer",
      city: request.city,
      _id: { $ne: req.user._id },
    }).select("_id");

    if (volunteers.length) {
      await Notification.insertMany(
        volunteers.map((volunteer) => ({
          user: volunteer._id,
          title: "New volunteer request",
          message: `${req.user.name} needs ${request.supportType} support in ${request.city}.`,
          type: "volunteer",
        }))
      );
    }

    req.io.emit("volunteer_request_created", request);
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
    ).populate("requester volunteer", "name phone city");

    if (!request) {
      return res.status(404).json({ success: false, message: "Volunteer request not found" });
    }

    await Notification.insertMany([
      {
        user: request.requester._id,
        title: "Volunteer request accepted",
        message: `${req.user.name} accepted your ${request.supportType} request.`,
        type: "volunteer",
      },
      {
        user: req.user._id,
        title: "You accepted a volunteer request",
        message: `You accepted ${request.requester.name}'s ${request.supportType} request.`,
        type: "volunteer",
      },
    ]);

    req.io.emit("volunteer_request_accepted", request);
    res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

export const listVolunteerRequests = async (req, res, next) => {
  try {
    const { city, status } = req.query;
    const filter = { ...(city && { city }), ...(status && { status }) };
    const requests = await VolunteerRequest.find(filter)
      .populate("requester volunteer", "name phone city");
    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

export const listVolunteers = async (req, res, next) => {
  try {
    const { city, skill } = req.query;
    const filter = { role: "volunteer" };
    if (city) filter.city = city;
    if (skill) filter.volunteerSkills = skill;

    const volunteers = await User.find(filter)
      .select("-password -__v -resetPasswordToken -resetPasswordExpires")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: volunteers });
  } catch (error) {
    next(error);
  }
};

export const joinVolunteerNetwork = async (req, res, next) => {
  try {
    const updates = {
      role: "volunteer",
      name: req.body.name,
      phone: req.body.phone,
      city: req.body.city,
      volunteerSkills: req.body.skills,
      volunteerAvailability: req.body.availability,
      volunteerExperience: req.body.experience,
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      Object.fromEntries(
        Object.entries(updates).filter(([, value]) => value !== undefined && value !== "")
      ),
      { new: true, runValidators: true }
    );

    await Notification.create({
      user: req.user._id,
      title: "Volunteer profile active",
      message: "You are now visible in the LifeLink volunteer network.",
      type: "volunteer",
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
