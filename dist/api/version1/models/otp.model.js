"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    email: String,
    otp: String,
    createdAt: { type: Date, default: Date.now, expires: 0 }
});
const OTP = mongoose_1.default.model("OTP", otpSchema, "otp");
exports.default = OTP;
