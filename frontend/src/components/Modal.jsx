// src/components/Modal.jsx
import React from "react";

export default function Modal({ open, title, onClose, children, size = "md" }) {
  if (!open) return null;
  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={onClose}>
      <div
        className={`bg-white rounded-xl shadow-lg w-full ${sizes[size]} mx-4`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Đóng</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
