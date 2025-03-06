"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    title: String,
    status: {
        type: String,
        enum: ["initial", "doing", "finish", "pending", "notFinish"],
        default: "initial"
    },
    content: String,
    timeStart: Date,
    timeFinish: Date,
    createdBy: String,
    listUsers: Array,
    taskParentID: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
}, {
    timestamps: true
});
const Tasks = mongoose_1.default.model("Tasks", taskSchema, "tasks");
exports.default = Tasks;
