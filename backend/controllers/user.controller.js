import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";


export const getSuggestedConnections = async (req,res)=>{
    try {
        const currentUser = await User.findById(req.user._id).select("connections");

        const suggestedUsers = await User.find({
             _id: {$ne:req.user._id, $nin: [...currentUser.connections] } 
            }).limit(3);

            res.json(suggestedUsers);
    } catch (error) {
        console.log("error in getSuggestedConnections",error);
        res.status(500).json({message:"something went wrong"});
    }
}

export const getPublicProfile = async (req, res) => {
	try {
		const currentUser = await User.findOne({ username: req.params.username }).select("-password");

		if (!currentUser) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(currentUser);
	} catch (error) {
		console.log("error in getPublicProfile", error);
		res.status(500).json({ message: "Something went wrong" });
	}
};


export const updateProfile = async (req,res)=>{
    try {
        const allowedFields=["first_name","last_name","email",
            "profilePic","bannerPic","headline"
            ,"location","about","skills","experience","education",];

        const updatedData={};
        for (const field of allowedFields){
            if(req.body[field]){
                updatedData[field] = req.body[field];
            }
        }   
        
        // update profile picture
        if(req.body.profilePic){
            const result = await cloudinary.uploader.upload(req.body.profilePic);
            updatedData.profilePic = result.secure_url;
        }

        //update banner picture
        if(req.body.bannerPic){
            const result = await cloudinary.uploader.upload(req.body.bannerPic);
            updatedData.bannerPic = result.secure_url;
        }

        const user =await User.findByIdAndUpdate(
            req.user._id,
            {$set:updatedData},
            {new:true}
            ).select("-password");

        res.json(user);

    } catch (error) {
        console.log("error in updateProfile",error);
        res.status(500).json({message:"something went wrong"});
    }
}