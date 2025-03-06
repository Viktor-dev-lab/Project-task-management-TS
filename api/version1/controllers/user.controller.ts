import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import OTP from "../models/otp.model";
import generateHelper from "../helpers/generate";
import sendMail from "../helpers/sendMail";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, email, phone, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const existEmail = await User.findOne({ email, deleted: false });
        if (existEmail) {
            res.json({ code: 400, message: "Email đã tồn tại!" });
            return;
        }

        const otp = generateHelper.generateOTP(6);
        await OTP.create({ phone, otp });

        const user = new User({
            fullName,
            email,
            phone,
            password: hashedPassword,
            token: generateHelper.generateRandomString(30),
        });

        await user.save();
        res.cookie("token", user.token);

        res.json({ code: 200, message: "Tạo tài khoản thành công!", token: user.token });
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, deleted: false });
        if (!user) {
            res.json({ code: 400, message: "Email không tồn tại!" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ success: false, message: "Mật khẩu không đúng!" });
            return;
        }

        res.cookie("token", user.token);
        res.json({ code: 200, message: "Đăng nhập thành công!", token: user.token });
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const existEmail = await User.findOne({ email, deleted: false });
        if (!existEmail) {
            res.json({ code: 400, message: "Email không tồn tại!" });
            return;
        }

        const otp = generateHelper.generateOTP(6);
        await OTP.create({ email, otp, createdAt: Date.now() + 3 * 60 * 1000 });
        sendMail(email, otp);

        res.status(200).json({ code: 200, message: "Xác thực thành công" });
    } catch (error) {
        console.error("Lỗi xác thực:", error);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
};

export const otpPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) {
            res.status(400).json({ code: 400, message: "Mã OTP đã hết hạn" });
            return;
        }

        const result = await OTP.findOne({ email, otp });
        if (!result) {
            res.status(400).json({ code: 400, message: "OTP không hợp lệ" });
            return;
        }

        await OTP.deleteOne({ email, otp });
        const user = await User.findOne({ email });
        res.cookie("token", user?.token);

        res.status(200).json({ code: 200, message: "Xác thực thành công", token: user?.token });
    } catch (error) {
        console.error("Lỗi xác thực:", error);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies.token;
        const { password } = req.body;
        const user = await User.findOne({ token });
        if (!user) {
            res.status(400).json({ code: 400, message: "Token không hợp lệ" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.status(400).json({ code: 400, message: "Vui lòng không đổi mật khẩu như cũ" });
            return;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await User.updateOne({ token }, { password: hashedPassword });

        res.status(200).json({ code: 200, message: "Đổi mật khẩu thành công" });
    } catch (error) {
        console.error("Lỗi đổi mật khẩu:", error);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
};

// export const detail = async (req: Request, res: Response): Promise<void> => {
//     try {
//         res.status(200).json({ code: 200, message: "Thành công", info: req.user });
//     } catch (error) {
//         console.error("Lỗi", error);
//         res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
//     }
// };

export const list = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find({ deleted: false }).select("fullName email");
        res.status(200).json({ code: 200, message: "Thành công", info: users });
    } catch (error) {
        console.error("Lỗi", error);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
};