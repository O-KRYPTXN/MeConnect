import Notification from "../models/notification.model.js";


export const getUserNotifications = async (req, res) => { // "/"
    try {

        const notifications = await Notification.find({ recipient: req.user._id })
        .populate("relatedUser", "username first_name last_name profilePic")
        .populate("relatedPost","content image")
        // .populate("messsage","content")
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



export const sendContactMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { recipientId } = req.params; // ✅ recipient from URL
    const senderId = req.user._id; // assumes you're using auth middleware to populate req.user

    if (!recipientId || !message) {
      return res.status(400).json({ message: "Recipient and message are required." });
    }

    // Optional: check if recipient exists
    // const recipientExists = await User.findById(recipientId);
    // if (!recipientExists) {
    //   return res.status(404).json({ message: "Recipient not found." });
    // }

    const notification = new Notification({
      recipient: recipientId,
      type: "message",
      relatedUser: senderId,
      messageContent: message.trim(),
    });

    await notification.save();

    res.status(201).json({ message: "Message sent successfully." });

  } catch (error) {
    console.error("Error in sendContactMessage:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};



