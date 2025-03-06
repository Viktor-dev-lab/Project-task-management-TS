import { Request, Response } from "express";
import Task from "../models/task.model";
import paginationHelper from "../helpers/pagination";
import searchHelper from "../helpers/search";

// [GET] api/v1/tasks
export const index = async (req: Request, res: Response) => {
  interface Find {
    deleted: boolean,
    status?: string,
    title?: RegExp
  }

  const find: Find = {
    deleted: false,
  }

  // Status
  if (req.query.status) find.status = req.query.status.toString();
  // Status

  // Sort
  const sort = {}
  if (req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey.toString();
    sort[sortKey] = req.query.sortValue
  }
  // Sort

  // Phân Trang
  const countProducts = await Task.countDocuments(find); // Đếm tổng số sản phẩm
  let Pagination = paginationHelper({
    currentPage: 1,
    limitItem: 2
  },
    req.query,
    countProducts
  );
  // Phân Trang

  // search
  const objectSearch = searchHelper(req.query); 

  if (req.query.keyword) { 
      find.title = objectSearch.regex;
  }

  // search

  const tasks = await Task
    .find(find)
    .sort(sort)
    .limit(Pagination.limitItem)
    .skip(Pagination.skip);

  res.json(tasks);
};

// [GET] api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, deleted: false });
    res.json(task);
  } catch (err) {
    res.json("Không tìm thấy !");
  }
};

// [PATCH] api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    await Task.updateOne({ _id: req.params.id }, { status: req.body.status });
    res.json({ code: 200, message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    res.json("Không tìm thấy !");
  }
};

// [PATCH] api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try {
    const { ids, key, value } = req.body;
    switch (key) {
      case "status":
        await Task.updateMany({ _id: { $in: ids } }, { status: value });
        res.json({ code: 200, message: "Cập nhật trạng thái thành công !" });
        break;
      case "delete":
        await Task.updateMany(
          { _id: { $in: ids } },
          { deleted: true, deletedAt: new Date() }
        );
        res.json({ code: 200, message: "Xóa thành công !" });
        break;
      default:
        res.json({ code: 400, message: "Không tồn tại" });
        break;
    }
  } catch (err) {
    res.json("Không tìm thấy !");
  }
};

// [POST] api/v1/tasks/create
// export const create = async (req: Request, res: Response) => {
//   try {
//     req.body.createdBy = req.user.id;
//     const task = new Task(req.body);
//     const data = await task.save();
//     res.json({ code: 200, message: "Tạo thành công", data });
//   } catch (err) {
//     res.json({ code: 400, message: "Lỗi" });
//   }
// };

// [PATCH] api/v1/tasks/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    await Task.updateOne({ _id: req.params.id }, req.body);
    res.json({ code: 200, message: "Cập nhật thành công" });
  } catch (err) {
    res.json({ code: 400, message: "Lỗi" });
  }
};

// [DELETE] api/v1/tasks/delete/:id
export const remove = async (req: Request, res: Response) => {
  try {
    await Task.updateOne({ _id: req.params.id }, { deleted: true, deletedAt: new Date() });
    res.json({ code: 200, message: "Xóa thành công" });
  } catch (err) {
    res.json({ code: 400, message: "Lỗi" });
  }
};

