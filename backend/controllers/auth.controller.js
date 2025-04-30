import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async(req,res)=>{
    try {
        const {first_name,last_name,username,email,password} = req.body;

        if (!first_name || !last_name || !username || !email || !password) {
            return res.status(400).json({message:"all fields are required"});
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({message:"email already exists"});
        }

        const existingUsername = await User.findOne({username});
        if(existingUsername){
            return res.status(400).json({message:"username already exists"});
        }

        if(password.length<8){
            return res.status(400).json({message:"password must be at least 8 characters"});
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password,salt);

        const user = new User({
            first_name,
            last_name,
            username,
            email,
            password:hashedPassword,
        });
        await user.save();

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY , {expiresIn:"3d"});
        res.cookie("jwt-MeConnect",token,
        {httpOnly:true,maxAge:3*24*60*60*1000,sameSite:"strict",secure:process.env.NODE_ENV==="production"});
       
        res.status(201).json({message:"user created successfully"});

        //todo : send welcome email
        
    } catch (error) {
        console.log("error in signup",error);
        res.status(500).json({message:"something went wrong"});
    }
}

export const login = async(req,res)=>{
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({message:"all fields are required"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
       
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"invalid credentials"});
        }

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY , {expiresIn:"3d"});
        await res.cookie("jwt-MeConnect",token,
        {
            httpOnly:true,
            maxAge:3*24*60*60*1000,
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production"
        });
       
        res.status(200).json({message:"user logged in successfully"});

    } catch (error) {
        console.log("error in login",error);
        res.status(500).json({message:"something went wrong"});
    }
}

export const logout = (req,res)=>{
    res.clearCookie("jwt-MeConnect");
    res.json({message:"logged out successfully"});
} 

// all routes above /api/v1/auth/endpoint

export const getCurrentUser = (req,res)=>{
   try {
     res.json(req.user);
   } catch (error) {
       console.log("error in getCurrentUser",error);
       res.status(500).json({message:"something went wrong can't get current user"});
   }
}
