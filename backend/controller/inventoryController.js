import InventoryItem from "../models/InventoryItem.js";

/** Lấy danh sách vật tư */
export const getAllInventory = async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** Lấy 1 vật tư theo ID */
export const getInventoryById = async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Không tìm thấy vật tư" });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** Tạo mới vật tư */
export const createInventory = async (req, res) => {
  try {
    const item = await InventoryItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** Cập nhật vật tư */
export const updateInventory = async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: "Không tìm thấy vật tư" });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** Xóa vật tư */
export const deleteInventory = async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Không tìm thấy vật tư" });
    res.json({ success: true, message: "Đã xóa vật tư" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};
