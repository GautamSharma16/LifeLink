import AmbulanceRequest from "../models/AmbulanceRequest.js";
import BloodRequest from "../models/BloodRequest.js";
import DonationHistory from "../models/DonationHistory.js";
import VolunteerRequest from "../models/VolunteerRequest.js";
import DonationCamp from "../models/DonationCamp.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const baseStats = {
      totalBloodRequests: 0,
      completedBloodRequests: 0,
      totalAmbulanceRequests: 0,
      totalVolunteerRequests: 0,
      totalDonations: 0,
      totalCamps: 0,
      openRequests: 0,
      completedToday: 0,
    };

    if (req.user.role === "admin") {
      const [
        totalBloodRequests,
        completedBloodRequests,
        totalAmbulanceRequests,
        totalVolunteerRequests,
        totalDonations,
        totalCamps,
        totalHospitals,
        verifiedHospitals,
      ] = await Promise.all([
        BloodRequest.countDocuments(),
        BloodRequest.countDocuments({ status: "completed" }),
        AmbulanceRequest.countDocuments(),
        VolunteerRequest.countDocuments(),
        DonationHistory.countDocuments(),
        DonationCamp.countDocuments(),
        User.countDocuments({ role: "hospital" }),
        User.countDocuments({ role: "hospital", hospitalVerified: true }),
      ]);

      return res.json({
        success: true,
        data: {
          ...baseStats,
          totalBloodRequests,
          completedBloodRequests,
          totalAmbulanceRequests,
          totalVolunteerRequests,
          totalDonations,
          totalCamps,
          totalHospitals,
          verifiedHospitals,
        },
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [myBloodRequests, myAmbulanceRequests, myVolunteerRequests, myDonations, myCamps, completedToday] =
      await Promise.all([
        BloodRequest.countDocuments({ requester: req.user._id }),
        AmbulanceRequest.countDocuments({ requester: req.user._id }),
        VolunteerRequest.countDocuments({ requester: req.user._id }),
        DonationHistory.countDocuments({ donor: req.user._id }),
        DonationCamp.countDocuments({ hospital: req.user._id }),
        BloodRequest.countDocuments({ requester: req.user._id, status: "completed", updatedAt: { $gte: today } }),
      ]);

    const roleOpenRequestCount =
      req.user.role === "volunteer"
        ? await BloodRequest.countDocuments({ status: "open", city: req.user.city })
        : req.user.role === "hospital"
          ? await BloodRequest.countDocuments({ status: "open", city: req.user.city })
          : await BloodRequest.countDocuments({ requester: req.user._id, status: "open" });

    return res.json({
      success: true,
      data: {
        ...baseStats,
        totalBloodRequests: myBloodRequests,
        totalAmbulanceRequests: myAmbulanceRequests,
        totalVolunteerRequests: myVolunteerRequests,
        totalDonations: myDonations,
        totalCamps: myCamps,
        openRequests: roleOpenRequestCount,
        completedToday,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentActivity = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};
