import taskRoutes from "./task.route";
import userRoutes from "./user.route";
import * as systemConfig from "../../../config/system";
// import authMiddleware from "../middlewares/auth.middleware";
import { Express } from "express";

const routeApi = (app: Express): void => {
    const PATH_VERSION1 = systemConfig.API_PATHS.version1;
    
    app.use(PATH_VERSION1 + "/tasks", taskRoutes);
    app.use(PATH_VERSION1 + "/users", userRoutes);
};

export default routeApi;