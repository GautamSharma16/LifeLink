import DonationCamp from "../models/DonationCamp.js";

export const createCamp = async (req, res, next) => {
  try {
    if (req.user.role !== "hospital") {
      return res.status(403).json({ success: false, message: "Only hospitals can create camps" });
    }
    const camp = await DonationCamp.create({
      ...req.body,
      hospital: req.user._id
    });
    
    req.io.emit("camp_created", camp);

    const User = (await import("../models/User.js")).default;
    const Notification = (await import("../models/Notification.js")).default;
    const volunteers = await User.find({ role: "volunteer", city: camp.city });

    const notifications = volunteers.map(v => ({
      user: v._id,
      title: "New Blood Donation Camp",
      message: `${req.user.hospitalName} is organizing a camp on ${new Date(camp.date).toLocaleDateString()}.`,
      type: "camp"
    }));
    await Notification.insertMany(notifications);
    
    return res.status(201).json({ success: true, data: camp });
  } catch (error) {
    next(error);
  }
};

export const getCamps = async (req, res, next) => {
  try {
    const { city, status } = req.query;
    const filter = { 
      ...(city && { city }), 
      ...(status && { status }) 
    };
    const camps = await DonationCamp.find(filter)
      .populate("hospital", "hospitalName phone city")
      .populate("volunteersJoined", "name phone");
    return res.json({ success: true, data: camps });
  } catch (error) {
    next(error);
  }
};

export const joinCamp = async (req, res, next) => {
  try {
    const camp = await DonationCamp.findById(req.params.id);
    if (!camp) return res.status(404).json({ success: false, message: "Camp not found" });

    if (camp.volunteersJoined.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: "Already joined" });
    }

    camp.volunteersJoined.push(req.user._id);
    await camp.save();

    const Notification = (await import("../models/Notification.js")).default;
    
    // Notify the hospital
    await Notification.create({
      user: camp.hospital,
      title: "New Volunteer for Camp",
      message: `${req.user.name} joined your camp at ${camp.location}.`,
      type: "camp"
    });

    // Notify the volunteer
    await Notification.create({
      user: req.user._id,
      title: "Successfully Joined Camp",
      message: `You are now a volunteer for the camp at ${camp.location}.`,
      type: "camp"
    });

    req.io.emit("camp_joined", { campId: camp._id, user: req.user.name });

    return res.json({ success: true, data: camp });
  } catch (error) {
    next(error);
  }
};
