import { generatetoken } from "../lib/util.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudnary.js";

// signup a new user  
export const signup = async (req, res) => {
  const { fullname, email, pass, bio } = req.body;
  try {
    if (!fullname || !email || !pass || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "Account already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);

    const newuser = await User.create({
      fullname,
      email,
      pass: hash,
      bio,
    });

    const token = generatetoken(newuser._id);

    res.json({
      success: true,
      userData: newuser,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// login user
export const login = async (req, res) => {
  try {
    const { email, pass } = req.body;

    const userdata = await User.findOne({ email });
    if (!userdata) {
      return res.json({ success: false, message: "User not found" });
    }

    const ispasscorrect = await bcrypt.compare(pass, userdata.pass);
    if (!ispasscorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generatetoken(userdata._id);

    res.json({
      success: true,
      userData: userdata,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// check if user is authenticated 
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};





// update user profile details

export const updateprofile = async (req, res) => {
  try {
    const { profilepic, bio, fullname } = req.body;
    const userId = req.user._id;
    let updateduser;

    if (!profilepic) {
      updateduser = await User.findByIdAndUpdate(
        userId,
        { bio, fullname },
        { new: true }
      ).select("-pass");
    } else {
      const upload = await cloudinary.uploader.upload(profilepic);
      updateduser = await User.findByIdAndUpdate(
        userId,
        { profilepic: upload.secure_url, bio, fullname },
        { new: true }
      ).select("-pass");
    }

    res.json({
      success: true,
      user: updateduser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
