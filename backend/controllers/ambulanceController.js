import AmbulanceRequest from "../models/AmbulanceRequest.js";
import Notification from "../models/Notification.js";

export const createAmbulanceRequest = async (req, res, next) => {
  try {
    const request = await AmbulanceRequest.create({
      ...req.body,
      requester: req.user._id
    });

    // Notify nearby drivers (simplification: emit to all for now)
    req.io.emit("ambulance_request_created", request);

    // Create persistent notifications for all ambulance drivers
    // Note: In a real app, you'd filter by city.
    const User = (await import("../models/User.js")).default;
    const drivers = await User.find({ role: "ambulance_driver", city: request.city });
    
    const notifications = drivers.map(driver => ({
      user: driver._id,
      title: "New Ambulance Request",
      message: `Emergency at ${request.pickupAddress}. Patient condition: ${request.patientCondition}`,
      type: "ambulance"
    }));
    if (notifications.length) {
      await Notification.insertMany(notifications);
    }

    return res.status(201).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

export const getAmbulanceRequests = async (req, res, next) => {
  try {
    const { city, status } = req.query;
    const filter = { 
      ...(city && { city }), 
      ...(status && { status }) 
    };

    if (req.user.role === "user") {
      filter.requester = req.user._id;
    }
    const requests = await AmbulanceRequest.find(filter)
      .populate("requester driver", "name phone city");
    return res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

export const acceptAmbulanceRequest = async (req, res, next) => {
  try {
    const existing = await AmbulanceRequest.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Ambulance request not found" });
    }
    if (existing.status !== "pending") {
      return res.status(400).json({ success: false, message: "This ride is no longer pending" });
    }

    const request = await AmbulanceRequest.findByIdAndUpdate(
      req.params.id,
      { driver: req.user._id, status: "assigned" },
      { new: true }
    ).populate("requester driver", "name phone city");

    await Notification.create({
      user: request.requester,
      title: "Ambulance Dispatched",
      message: `Your ambulance request has been accepted by ${req.user.name}.`,
      type: "ambulance"
    });

    req.io.emit("ambulance_request_accepted", request);

    return res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

export const updateAmbulanceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const request = await AmbulanceRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    req.io.emit("ambulance_status_updated", request);

    return res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};
