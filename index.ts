import express, { Express } from "express";
import dotenv from "dotenv";
import database from "./config/database";
import bodyParser from "body-parser";
// import cors from "cors";
// import cookieParser from "cookie-parser";
import routeApi from "./api/version1/routes/index.route";

// Load environment variables
dotenv.config();

// Connect to database
database.connect();

const app: Express = express();
const port: number = Number(process.env.PORT) || 3000;

// Set view engine
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Middleware
// app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
// app.use(cors());
// app.use(cookieParser("Xuandeptrai"));

// Routes
routeApi(app);

// Start server
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
