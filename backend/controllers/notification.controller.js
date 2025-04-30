import Notification from "../models/notification.model.js";

export const getUserNotifications = async (req, res) => { // "/"
    try {

        const notifications = await Notification.find({ recipient: req.user._id })
        .populate("relatedUser", "first_name last_name profilePic")
        .populate("relatedPost","content image")
        .sort({ createdAt: -1 });


        res.status(200).json(notifications);
    } catch (error) {
        console.log("error in getNotifications", error);
        res.status(500).json({ message: "something went wrong" });
    }
};

export const markNotificationAsRead = async (req, res) => { // "/:id/read"
    const notificationId = req.params.id;
    try {

        const notification=await Notification.findOneAndUpdate(
          {  _id:notificationId, recipient: req.user._id }, //filter
            {read:true},
            {new:true}
     )

        res.json(notification);

    } catch (error) {
        console.log("error in markNotificationAsRead", error);
        res.status(500).json({ message: "something went wrong" });
    }
};

export const deleteNotification = async (req, res) => { // "/:id/delete"
    const notificationId = req.params.id;
    try {        
        const notification = await Notification.findOneAndDelete({
             _id: notificationId, recipient: req.user._id });

    
        res.json({ message: "Notification deleted successfully" });

    } catch (error) {
        console.log("error in deleteNotification", error);
        res.status(500).json({ message: "something went wrong" });
    }
};