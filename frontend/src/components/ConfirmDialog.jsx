// src/components/ConfirmDialog.jsx
import React from "react";

export default function ConfirmDialog({ open, title = "Xác nhận", message, onCancel, onConfirm, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="p-5">
          <p className="text-gray-700 mb-4">{message}</p>
          <div className="flex justify-end gap-2">
            <button onClick={onCancel} className="px-4 py-2 rounded border">Hủy</button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-300" : "bg-red-600 hover:bg-red-700"}`}
            >
              {loading ? "Đang xóa..." : "Xóa"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
