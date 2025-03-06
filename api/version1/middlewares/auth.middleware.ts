// import { Request, Response, NextFunction } from "express";
// import User from "../models/user.model";

// const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
//   if (req.headers.authorization){
//     const token = req.headers.authorization.split(" ")[1];
//     const user = await User.findOne({
//       token: token,
//       deleted: false,
//     }).select("-password");

//     if (!user){
//       return res.status(400).json({
//         code: 400,
//         message: "Token không hợp lệ"
//       });
//     }
//     req.user = user;
//     next();
//   } else {
//     res.status(400).json({
//       code: 400,
//       message: "Vui lòng gửi token lên"
//     });
//   }
// }

// export default {requireAuth};