import AmbulanceRequest from "../models/AmbulanceRequest.js";
import BloodRequest from "../models/BloodRequest.js";
import DonationHistory from "../models/DonationHistory.js";
import VolunteerRequest from "../models/VolunteerRequest.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const [blood, completedBlood, ambulance, volunteer, donations] = await Promise.all([
      BloodRequest.countDocuments(),
      BloodRequest.countDocuments({ status: "completed" }),
      AmbulanceRequest.countDocuments(),
      VolunteerRequest.countDocuments(),
      DonationHistory.countDocuments(),
    ]);

    return res.json({
      success: true,
      data: {
        totalBloodRequests: blood,
        completedBloodRequests: completedBlood,
        totalAmbulanceRequests: ambulance,
        totalVolunteerRequests: volunteer,
        totalDonations: donations,
      },
    });
  } catch (error) {
    next(error);
  }
};
