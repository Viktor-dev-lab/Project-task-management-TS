"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_route_1 = __importDefault(require("./api/version1/routes/index.route"));
dotenv_1.default.config();
database_1.default.connect();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3000;
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(body_parser_1.default.json());
(0, index_route_1.default)(app);
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
