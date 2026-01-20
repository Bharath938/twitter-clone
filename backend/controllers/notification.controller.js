import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      to: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate({ path: "from", select: "username profileImg" });

    await Notification.updateMany({ to: req.user._id }, { read: true });

    res.status(200).json(notifications);
  } catch (err) {
    console.log("Error in getNotification controller", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ to: req.user._id });

    res.status(200).json({ message: "Notifications Deleted Successfully" });
  } catch (err) {
    console.log("Error in deleteNotifications controller", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
