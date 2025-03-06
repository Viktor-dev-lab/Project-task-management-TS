import mongoose, { Document, Schema } from "mongoose";

const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    createdAt: { type: Date, default: Date.now, expires: 0 } 
});

const OTP = mongoose.model("OTP", otpSchema, "otp");

export default OTP;