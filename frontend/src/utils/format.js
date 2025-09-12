// utils/format.js
export const formatVnd = (n) => {
  if (n == null) return "Liên hệ";
  return `${Number(n).toLocaleString("vi-VN")}đ`;
};

export const applyDiscount = (value, percent) => {
  if (!percent || percent <= 0) return value;
  const v = Math.round((value * (100 - percent)) / 100);
  return Math.round(v / 1000) * 1000; // làm tròn nghìn
};
