// import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email: email });

    if (exists) {
      return res.json({ success: false, message: "User already exists!!!" });
    }

    // check email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "use a valid email !!" });
    }

    // check password length
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "password length should be atleast 8 characters !!!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      name,
      email,
      password: hash,
    });

    const token = jwt.sign(
      { email: newUser.email, userId: newUser._id },
      process.env.JWT_SECRET
    );

    res.json({
      success: true,
      message: "User registered successfully!",
      token,
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.json({ success: false, message: "User not found!!!" });
    }

    // compare passwords
    bcrypt.compare(password, user.password, (error, result) => {
      if (result) {
        const token = jwt.sign(
          { email: email, userId: user._id },
          process.env.JWT_SECRET
        );
        res.json({ success: true, message: "User can login", token });
      } else {
        res.json({ success: false, message: "Invalid credentials" });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export { 
    registerUser,
    loginUser 
    };
