import express from "express";
import * as controller from "../controllers/user.controller";
// import * as authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

// Routes
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/password/forgot", controller.forgotPassword);
router.post("/password/otp", controller.otpPassword);
router.post("/password/reset", controller.resetPassword);
// router.get("/detail", authMiddleware.requireAuth, controller.detail);
router.post("/list", controller.list);

export default router;
