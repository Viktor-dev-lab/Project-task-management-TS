"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.detail = exports.resetPassword = exports.otpPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const otp_model_1 = __importDefault(require("../models/otp.model"));
const generate_1 = __importDefault(require("../helpers/generate"));
const sendMail_1 = __importDefault(require("../helpers/sendMail"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, phone, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const existEmail = yield user_model_1.default.findOne({ email, deleted: false });
        if (existEmail) {
            res.json({ code: 400, message: "Email đã tồn tại!" });
            return;
        }
        const otp = generate_1.default.generateOTP(6);
        yield otp_model_1.default.create({ phone, otp });
        const user = new user_model_1.default({
            fullName,
            email,
            phone,
            password: hashedPassword,
            token: generate_1.default.generateRandomString(30),
        });
        yield user.save();
        res.cookie("token", user.token);
        res.json({ code: 200, message: "Tạo tài khoản thành công!", token: user.token });
    }
    catch (error) {
        console.error("Lỗi đăng ký:", error);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({ email, deleted: false });
        if (!user) {
            res.json({ code: 400, message: "Email không tồn tại!" });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ success: false, message: "Mật khẩu không đúng!" });
            return;
        }
        res.cookie("token", user.token);
        res.json({ code: 200, message: "Đăng nhập thành công!", token: user.token });
    }
    catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const existEmail = yield user_model_1.default.findOne({ email, deleted: false });
        if (!existEmail) {
            res.json({ code: 400, message: "Email không tồn tại!" });
            return;
        }
        const otp = generate_1.default.generateOTP(6);
        yield otp_model_1.default.create({ email, otp, createdAt: Date.now() + 3 * 60 * 1000 });
        (0, sendMail_1.default)(email, otp);
        res.status(200).json({ code: 200, message: "Xác thực thành công" });
    }
    catch (error) {
        console.error("Lỗi xác thực:", error);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
});
exports.forgotPassword = forgotPassword;
const otpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const otpRecord = yield otp_model_1.default.findOne({ email });
        if (!otpRecord) {
            res.status(400).json({ code: 400, message: "Mã OTP đã hết hạn" });
            return;
        }
        const result = yield otp_model_1.default.findOne({ email, otp });
        if (!result) {
            res.status(400).json({ code: 400, message: "OTP không hợp lệ" });
            return;
        }
        yield otp_model_1.default.deleteOne({ email, otp });
        const user = yield user_model_1.default.findOne({ email });
        res.cookie("token", user === null || user === void 0 ? void 0 : user.token);
        res.status(200).json({ code: 200, message: "Xác thực thành công", token: user === null || user === void 0 ? void 0 : user.token });
    }
    catch (error) {
        console.error("Lỗi xác thực:", error);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
});
exports.otpPassword = otpPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        const { password } = req.body;
        const user = yield user_model_1.default.findOne({ token });
        if (!user) {
            res.status(400).json({ code: 400, message: "Token không hợp lệ" });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (isMatch) {
            res.status(400).json({ code: 400, message: "Vui lòng không đổi mật khẩu như cũ" });
            return;
        }
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        yield user_model_1.default.updateOne({ token }, { password: hashedPassword });
        res.status(200).json({ code: 200, message: "Đổi mật khẩu thành công" });
    }
    catch (error) {
        console.error("Lỗi đổi mật khẩu:", error);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
});
exports.resetPassword = resetPassword;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ code: 200, message: "Thành công", info: req["user"] });
    }
    catch (error) {
        console.error("Lỗi", error);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
});
exports.detail = detail;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find({ deleted: false }).select("fullName email");
        res.status(200).json({ code: 200, message: "Thành công", info: users });
    }
    catch (error) {
        console.error("Lỗi", error);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
});
exports.list = list;
