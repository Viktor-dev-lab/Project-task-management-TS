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
exports.remove = exports.edit = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.index = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const pagination_1 = __importDefault(require("../helpers/pagination"));
const search_1 = __importDefault(require("../helpers/search"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false,
    };
    if (req.query.status)
        find.status = req.query.status.toString();
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue;
    }
    const countProducts = yield task_model_1.default.countDocuments(find);
    let Pagination = (0, pagination_1.default)({
        currentPage: 1,
        limitItem: 2
    }, req.query, countProducts);
    const objectSearch = (0, search_1.default)(req.query);
    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }
    const tasks = yield task_model_1.default
        .find(find)
        .sort(sort)
        .limit(Pagination.limitItem)
        .skip(Pagination.skip);
    res.json(tasks);
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield task_model_1.default.findOne({ _id: req.params.id, deleted: false });
        res.json(task);
    }
    catch (err) {
        res.json("Không tìm thấy !");
    }
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield task_model_1.default.updateOne({ _id: req.params.id }, { status: req.body.status });
        res.json({ code: 200, message: "Cập nhật trạng thái thành công" });
    }
    catch (err) {
        res.json("Không tìm thấy !");
    }
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Status;
        (function (Status) {
            Status["TRANG_THAI"] = "status";
            Status["XOA"] = "delete";
        })(Status || (Status = {}));
        const { ids, key, value } = req.body;
        switch (key) {
            case (Status.TRANG_THAI):
                yield task_model_1.default.updateMany({ _id: { $in: ids } }, { status: value });
                res.json({ code: 200, message: "Cập nhật trạng thái thành công !" });
                break;
            case (Status.XOA):
                yield task_model_1.default.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() });
                res.json({ code: 200, message: "Xóa thành công !" });
                break;
            default:
                res.json({ code: 400, message: "Không tồn tại" });
                break;
        }
    }
    catch (err) {
        res.json("Không tìm thấy !");
    }
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = new task_model_1.default(req.body);
        const data = yield task.save();
        res.json({ code: 200, message: "Tạo thành công", data });
    }
    catch (err) {
        res.json({ code: 400, message: "Lỗi" });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield task_model_1.default.updateOne({ _id: req.params.id }, req.body);
        res.json({ code: 200, message: "Cập nhật thành công" });
    }
    catch (err) {
        res.json({ code: 400, message: "Lỗi" });
    }
});
exports.edit = edit;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield task_model_1.default.updateOne({ _id: req.params.id }, { deleted: true, deletedAt: new Date() });
        res.json({ code: 200, message: "Xóa thành công" });
    }
    catch (err) {
        res.json({ code: 400, message: "Lỗi" });
    }
});
exports.remove = remove;
