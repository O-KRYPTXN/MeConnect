import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const sendConnectionRequest = async (req, res) => { 
    try {
        const  recipientId  = req.params.id;
        const senderId = req.user._id;

        if (senderId.equals(recipientId) ) {
            return res.status(400).json({ message: "You can't send connection request to yourself" });
        }

        if(req.user.connections.some(conn => conn.toString() === recipientId  )){
            return res.status(400).json({ message: "You are already connected with this user" });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            sender: req.user._id,
            recipient: recipientId,
            status: "pending",
        });

        if(connectionRequest){
            return res.status(400).json({ message: "You already sent a connection request to this user" });
        }
        const newConnectionRequest = new ConnectionRequest({
            sender: senderId,
            recipient: recipientId,
        });
        await newConnectionRequest.save();


        res.status(201).json({ message: "Connection request sent successfully" });

    } catch (error) {
        console.log("error in sendConnectionRequest", error);
        res.status(500).json({ message: "something went wrong" });
    }
    }

export const acceptConnectionRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        const userId = req.user._id;
        const connectionRequest = await ConnectionRequest.findById(requestId)
        .populate("sender", "first_name last_name profilePic")
        .populate("recipient", "first_name last_name profilePic"); 

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found" });
        }
        if(!connectionRequest.recipient.equals(userId) ){
            return res.status(400).json({ message: "You can't accept this connection request" });
        }
        if(connectionRequest.status !== "pending" ){
            return res.status(400).json({ message: "This connection request has already been processed" });
        }

        connectionRequest.status = "accepted";
        await connectionRequest.save();

        await User.findByIdAndUpdate(userId, { $addToSet: { connections: connectionRequest.sender } });
        await User.findByIdAndUpdate(connectionRequest.sender, { $addToSet: { connections: userId } });

        const notification = new Notification({
            recipient: connectionRequest.sender,
            type:"connectionAccepted",
            relatedUser:userId,
        })
        await notification.save()

        res.status(201).json({ message: "Connection request accepted successfully" });

    } catch (error) {
        console.log("error in acceptConnectionRequest", error);
        res.status(500).json({ message: "something went wrong" });
    }
}
export const rejectConnectionRequest = async(req,res)=>{
    try {
        const requestId  = req.params.id;
        const userId = req.user._id;
        const connectionRequest = await ConnectionRequest.findById(requestId)
       
        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found" });
        }
        if(!connectionRequest.recipient.equals(userId) ){
            return res.status(403).json({ message: "un authorized" });
        }
        if(connectionRequest.status !== "pending" ){
            return res.status(400).json({ message: "This connection request has already been processed" });
        }
        
        connectionRequest.status = "rejected"
        await connectionRequest.save()

        res.json("connection request rejected")
        
    } catch (error) {
        console.log("error in rejectingConnectionRequest", error);
        res.status(500).json({ message: "something went wrong" });
    }

} 
export const getConnectionRequests = async (req, res) => { 
    try {

        const connectionRequests = await ConnectionRequest.find({ recipient: req.user._id ,status : "pending" })
        .populate("sender", "username first_name last_name profilePic").sort({ createdAt: -1 });

        res.status(200).json(connectionRequests);

    } catch (error) {
        console.log("error in getConnectionRequests", error);
        res.status(500).json({ message: "something went wrong" });
    }
};

export const getUserConnections = async (req, res) => { 
    try {
      const userId = req.user._id
      const user = await User.findById(userId)
      .populate("connections" , "username first_name last_name profilepic connections")
      
      if(!user){
        return res.status(404).json({message: "user not found"})
      }

      res.json(user.connections)

    } catch (error) {
        console.log("error in getUserConnections", error);
        res.status(500).json({ message: "something went wrong" });
    }
};

export const deleteConnection = async (req,res)=>{
try {
    const myId=req.user._id
    const {userId} = req.params

    if (myId.toString() === userId) {
        return res.status(400).json({ message: "You cannot remove connection with yourself" });
    }
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }


    await User.findByIdAndUpdate(myId , {$pull:{connections:userId}})
    await User.findByIdAndUpdate(userId , {$pull:{connections:myId}})
    
    res.json({message:"connection removed successfully"})

} catch (error) {
    console.log("error in deleteconnection", error);
        res.status(500).json({ message: "something went wrong" });
}

}

export const getConnectionStatus = async (req, res) => {
	try {
		const targetUserId = req.params.userId;
		const currentUserId = req.user._id;

		const currentUser = req.user;
		if (currentUser.connections.includes(targetUserId)) {
			return res.json({ status: "connected" });
		}

		const pendingRequest = await ConnectionRequest.findOne({
			$or: [
				{ sender: currentUserId, recipient: targetUserId },
				{ sender: targetUserId, recipient: currentUserId },
			],
			status: "pending",
		});

		if (pendingRequest) {
			if (pendingRequest.sender.toString() === currentUserId.toString()) {
				return res.json({ status: "pending" });
			} else {
				return res.json({ status: "received", requestId: pendingRequest._id });
			}
		}

		// if no connection or pending req found
		res.json({ status: "not_connected" });
	} catch (error) {
		console.error("Error in getConnectionStatus controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};