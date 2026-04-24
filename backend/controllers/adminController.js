import User from "../models/User.js";
import BloodRequest from "../models/BloodRequest.js";
import AmbulanceRequest from "../models/AmbulanceRequest.js";
import DonationCamp from "../models/DonationCamp.js";
import VolunteerRequest from "../models/VolunteerRequest.js";
import Notification from "../models/Notification.js";

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const banUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: true },
      { new: true }
    ).select("-password");

    if (user) {
      await Notification.create({
        user: user._id,
        title: "Account restricted",
        message: "An administrator has restricted your account. Please contact support for help.",
        type: "admin",
      });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const verifyHospital = async (req, res, next) => {
  try {
    const hospital = await User.findOneAndUpdate(
      { _id: req.params.id, role: "hospital" },
      { hospitalVerified: true },
      { new: true }
    ).select("-password");

    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital user not found" });
    }

    await Notification.create({
      user: hospital._id,
      title: "Hospital verified",
      message: `${hospital.hospitalName || hospital.name} is now verified on LifeLink.`,
      type: "hospital",
    });

    res.json({ success: true, data: hospital });
  } catch (error) {
    next(error);
  }
};

export const getAdminOverview = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalHospitals,
      verifiedHospitals,
      totalBloodRequests,
      totalAmbulanceRequests,
      totalVolunteerRequests,
      totalCamps,
      recentUsers,
      recentNotifications,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "hospital" }),
      User.countDocuments({ role: "hospital", hospitalVerified: true }),
      BloodRequest.countDocuments(),
      AmbulanceRequest.countDocuments(),
      VolunteerRequest.countDocuments(),
      DonationCamp.countDocuments(),
      User.find().select("-password").sort({ createdAt: -1 }).limit(8),
      Notification.find().sort({ createdAt: -1 }).limit(8),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalHospitals,
          verifiedHospitals,
          totalBloodRequests,
          totalAmbulanceRequests,
          totalVolunteerRequests,
          totalCamps,
        },
        users: recentUsers,
        auditLog: recentNotifications,
      },
    });
  } catch (error) {
    next(error);
  }
};
