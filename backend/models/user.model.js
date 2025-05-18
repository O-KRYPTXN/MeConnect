import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name : {
        type : String,
        required : true
    },
    last_name : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    profilePic : {
        type : String,
        default : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    bannerPic : {
        type : String,
        default : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },headline : {
        type : String,
        default : ""
    },location : {
        type : String,
        default : ""
    },about : {
        type : String,
        default : ""
    },skills:[String],
    experience : [{
        company : String,
        title : String,
        from : Date,
        to : Date,
        description: String
    }],education : [{
        school : String,
        field : String,
        from : Date,
        to : Date
    }],connections : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }]
},{timestamps:true});


const User = mongoose.model("User",userSchema);

export default User;