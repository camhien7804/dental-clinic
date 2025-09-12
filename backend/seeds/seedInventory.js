// backend/seeds/seedInventory.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import InventoryItem from "../models/inventoryItem.js";
import User from "../models/user.js";

// ✅ Load config.env đúng chỗ, không phụ thuộc thư mục chạy
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../config.env") });

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URL;

async function seedInventory() {
  try {
    console.log("🔍 MONGO_URI =", mongoUri);
    if (!mongoUri) throw new Error("MONGO_URI không tồn tại trong config.env");

    await mongoose.connect(mongoUri);
    console.log("✅ Kết nối MongoDB thành công");

    // tìm user admin
    let createdBy = null;
    try {
      const adminUser = await User.findOne({ role: "admin" });
      if (adminUser) {
        createdBy = adminUser._id;
        console.log("👤 Gán createdBy =", createdBy.toString());
      } else {
        console.log("⚠️ Không tìm thấy admin, createdBy = null");
      }
    } catch {
      console.log("⚠️ Không query được user, createdBy = null");
    }

    // danh sách 30 vật tư mẫu
    const items = [
      { sku: "BT001", name: "Bao tay y tế", quantity: 100, unit: "pcs", minQuantity: 10, note: "Dùng 1 lần, latex không bột", createdBy },
      { sku: "KM001", name: "Khẩu trang y tế 3 lớp", quantity: 200, unit: "pcs", minQuantity: 20, note: "Dùng cho bác sĩ và bệnh nhân", createdBy },
      { sku: "TT001", name: "Thuốc tê Lidocain 2%", quantity: 50, unit: "lọ", minQuantity: 5, note: "Dùng trong nhổ răng, tiểu phẫu", createdBy },
      { sku: "CT001", name: "Chỉ nha khoa", quantity: 80, unit: "cuộn", minQuantity: 10, note: "Hỗ trợ chăm sóc sau điều trị", createdBy },
      { sku: "KT001", name: "Kim tiêm nha khoa", quantity: 150, unit: "cái", minQuantity: 15, note: "Kim vô trùng", createdBy },
      { sku: "VT001", name: "Vật liệu trám Composite", quantity: 30, unit: "tuýp", minQuantity: 5, note: "Trám thẩm mỹ", createdBy },
      { sku: "DL001", name: "Dung dịch sát khuẩn", quantity: 20, unit: "chai", minQuantity: 3, note: "Dùng trước/sau điều trị", createdBy },
      { sku: "CC001", name: "Cốc giấy súc miệng", quantity: 500, unit: "pcs", minQuantity: 50, note: "Dùng 1 lần", createdBy },
      { sku: "DC001", name: "Dụng cụ nạy", quantity: 25, unit: "cái", minQuantity: 3, note: "Dụng cụ khám nha khoa", createdBy },
      { sku: "MG001", name: "Gương nha khoa", quantity: 40, unit: "cái", minQuantity: 5, note: "Khám và kiểm tra răng", createdBy },
      { sku: "KL001", name: "Kìm nhổ răng", quantity: 15, unit: "cái", minQuantity: 2, note: "Dùng trong tiểu phẫu", createdBy },
      { sku: "NQ001", name: "Nha chu quản", quantity: 30, unit: "cái", minQuantity: 5, note: "Dụng cụ điều trị nha chu", createdBy },
      { sku: "XM001", name: "Xi măng nha khoa", quantity: 25, unit: "lọ", minQuantity: 5, note: "Dùng trong trám và phục hình", createdBy },
      { sku: "AO001", name: "Alginat lấy dấu", quantity: 20, unit: "túi", minQuantity: 3, note: "Dùng lấy dấu răng", createdBy },
      { sku: "BS001", name: "Bông gòn y tế", quantity: 300, unit: "gói", minQuantity: 30, note: "Dùng cầm máu và vệ sinh", createdBy },
      { sku: "ND001", name: "Nước súc miệng sát khuẩn", quantity: 40, unit: "chai", minQuantity: 5, note: "Cho bệnh nhân sau điều trị", createdBy },
      { sku: "MT001", name: "Mặt nạ phẫu thuật", quantity: 60, unit: "pcs", minQuantity: 10, note: "Bảo hộ bác sĩ", createdBy },
      { sku: "GA001", name: "Gạc vô trùng", quantity: 200, unit: "pcs", minQuantity: 20, note: "Thay băng vết thương", createdBy },
      { sku: "BP001", name: "Bơm tiêm 5ml", quantity: 100, unit: "cái", minQuantity: 10, note: "Dùng cho thuốc tê", createdBy },
      { sku: "BP002", name: "Bơm tiêm 10ml", quantity: 80, unit: "cái", minQuantity: 10, note: "Dùng trong truyền dịch nhỏ", createdBy },
      { sku: "TD001", name: "Thuốc giảm đau Paracetamol", quantity: 100, unit: "vỉ", minQuantity: 10, note: "Giảm đau sau điều trị", createdBy },
      { sku: "KS001", name: "Kháng sinh Amoxicillin", quantity: 70, unit: "hộp", minQuantity: 5, note: "Dùng cho bệnh nhân sau phẫu thuật", createdBy },
      { sku: "KS002", name: "Kháng sinh Metronidazole", quantity: 60, unit: "hộp", minQuantity: 5, note: "Điều trị viêm nhiễm", createdBy },
      { sku: "NC001", name: "Nước cất pha loãng", quantity: 50, unit: "chai", minQuantity: 5, note: "Dùng pha thuốc", createdBy },
      { sku: "TB001", name: "Thun chỉnh nha", quantity: 200, unit: "pcs", minQuantity: 20, note: "Hỗ trợ niềng răng", createdBy },
      { sku: "NB001", name: "Nút bông chặn máu", quantity: 150, unit: "pcs", minQuantity: 15, note: "Dùng khi nhổ răng", createdBy },
      { sku: "KL002", name: "Kìm bẻ dây chỉnh nha", quantity: 10, unit: "cái", minQuantity: 2, note: "Dùng trong chỉnh nha", createdBy },
      { sku: "DD001", name: "Đèn trám quang trùng hợp", quantity: 5, unit: "cái", minQuantity: 1, note: "Thiết bị hỗ trợ trám", createdBy },
      { sku: "ML001", name: "Máy lấy cao răng siêu âm", quantity: 3, unit: "cái", minQuantity: 1, note: "Thiết bị điều trị nha khoa", createdBy },
      { sku: "GH001", name: "Ghế nha khoa", quantity: 2, unit: "cái", minQuantity: 1, note: "Trang thiết bị chính", createdBy },
    ];

    for (const item of items) {
      const exists = await InventoryItem.findOne({ sku: item.sku });
      if (!exists) {
        await InventoryItem.create(item);
        console.log("➕ Đã thêm:", item.name);
      } else {
        console.log("✅ Đã tồn tại:", item.name);
      }
    }

    console.log("🎉 Seed xong Inventory!");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi seed:", err.message);
    process.exit(1);
  }
}

seedInventory();
