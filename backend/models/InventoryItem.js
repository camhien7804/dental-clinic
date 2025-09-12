import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  quantity: { type: Number, default: 0, min: 0 },
  unit: { type: String, default: "pcs" },
  minQuantity: { type: Number, default: 0, min: 0 },
  note: { type: String, default: "" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.models.InventoryItem || mongoose.model("InventoryItem", inventoryItemSchema);
