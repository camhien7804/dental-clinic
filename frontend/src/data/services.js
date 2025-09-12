// Danh mục chuẩn (slug -> tên hiển thị)
export const SERVICE_CATEGORIES = {
  "trong-rang-implant": "Trồng răng Implant",
  "nieng-rang": "Niềng răng",
  "nha-khoa-tong-quat": "Nha khoa tổng quát",
  "nha-khoa-tre-em": "Nha khoa trẻ em",
};

// ====== Helpers định dạng & tính giảm giá ======
export const formatVND = (n) =>
  `${Number(n || 0).toLocaleString("vi-VN")}đ`;

// Tính giá sau giảm (làm tròn nghìn cho đẹp)
export const afterDiscount = (value, percent) => {
  if (!percent || percent <= 0) return value;
  const v = Math.round((value * (100 - percent)) / 100);
  // làm tròn về bội số 1000
  return Math.round(v / 1000) * 1000;
};

export const afterDiscountRange = (min, max, percent) => {
  if (!percent || percent <= 0) return [min, max];
  return [afterDiscount(min, percent), afterDiscount(max, percent)];
};

// ===============================================

export const services = [
  // ========= TRỒNG RĂNG IMPLANT =========
  {
    id: "imp-std",
    title: "Trồng răng Implant tiêu chuẩn",
    slug: "trong-rang-implant-tieu-chuan",
    categorySlug: "trong-rang-implant",
    category: "Trồng răng Implant",
    image: "images/services/trong_rang_implant.jpg",
    priceMin: 24000000, priceMax: 27000000,
    discountPercent: 15,
    tags: ["khuyến mãi", "bán chạy"],
    detail: {
      gallery: [
        "images/services/implant-standard.jpg",
        "images/services/hinh-implant.jpg",
        "images/services/implant_xray.jpg",
      ],
      unit: "Lần",
      shortNotes: "*Chi phí phụ thuộc tình trạng xương & chỉ định bác sĩ.",
      ctas: { phone: "19008059", bookingUrl: "/dat-lich?service=implant-standard" },
      content: [
        { type: "h2", text: "Tổng quan" },
        { type: "p", text: "Giải pháp phục hồi răng mất với trụ Titanium tích hợp xương, đảm bảo ăn nhai tốt và thẩm mỹ tự nhiên." },
        { type: "h2", text: "Phù hợp với" },
        { type: "ul", items: ["Mất 1 răng/ nhiều răng", "Xương hàm đủ thể tích", "Sức khoẻ toàn thân ổn định"] },
        { type: "h2", text: "Quy trình" },
        { type: "ul", items: ["Khám & chụp phim 3D", "Cấy trụ", "Chờ tích hợp xương", "Gắn mão sứ hoàn tất"] },
      ],
    },
  },
  {
    id: "imp-straumann",
    title: "Trụ Implant Straumann BLT SLActive",
    slug: "tru-implant-straumann-blt-slactive",
    categorySlug: "trong-rang-implant",
    category: "Trồng răng Implant",
    image: "/images/services/Dental-Implant-X-Rays.jpg",
    price: 35000000,
    discountPercent: 10,
    tags: ["khuyến mãi"],
    detail: {
      gallery: [
        "/images/services/straumann-cover.jpg",
        "/images/services/straumann-1.jpg",
        "/images/services/straumann-2.jpg",
      ],
      unit: "Lần",
      shortNotes: "Công nghệ SLActive™ giúp tích hợp xương nhanh.",
      ctas: { phone: "19008059", bookingUrl: "/dat-lich?service=implant-straumann" },
      content: [
        { type: "h2", text: "Đặc điểm nổi bật" },
        { type: "p", text: "Dòng trụ Thuỵ Sĩ cao cấp, bền vững, tỉ lệ tích hợp xương cao, tuổi thọ dài." },
        { type: "h2", text: "Ưu điểm" },
        { type: "ul", items: ["Tính ổn định sơ khởi tốt", "Thẩm mỹ lợi – răng tối ưu", "Tuổi thọ lâu dài"] },
      ],
    },
  },
  {
    id: "imp-allon4",
    title: "Phục hình All-on-4 (toàn cung)",
    slug: "implant-all-on-4",
    categorySlug: "trong-rang-implant",
    category: "Trồng răng Implant",
    image: "/images/services/hinh_cam_4_cai.jpg",
    priceMin: 145000000, priceMax: 185000000,
    discountPercent: 12,
    tags: ["cao cấp"],
    detail: {
      gallery: ["/images/services/implant-allon4.jpg"],
      unit: "Hàm",
      shortNotes: "Giải pháp toàn hàm 4 trụ, phục hồi nhanh chức năng ăn nhai.",
      ctas: { phone: "19008059", bookingUrl: "/dat-lich?service=implant-allon4" },
      content: [
        { type: "h2", text: "Ai phù hợp?" },
        { type: "ul", items: ["Mất răng toàn hàm", "Xương hàm còn đủ vùng chịu lực", "Mong muốn phục hồi nhanh"] },
      ],
    },
  },

  // ========= NIỀNG RĂNG =========
  {
    id: "ortho-metal",
    title: "Niềng răng mắc cài kim loại",
    slug: "nieng-rang-mac-cai-kim-loai",
    categorySlug: "nieng-rang",
    category: "Niềng răng",
    image: "/images/services/nieng_rang_mac_cai.jpeg",
    priceMin: 18000000, priceMax: 28000000,
    discountPercent: 0,
    tags: ["tiết kiệm"],
    detail: {
      gallery: ["/images/services/ortho-metal.jpg", "/images/services/ortho-chair.jpg"],
      unit: "Liệu trình",
      shortNotes: "Thời gian điều trị 18–24 tháng (tuỳ mức độ).",
      ctas: { phone: "19008059", bookingUrl: "/dat-lich?service=ortho-metal" },
      content: [
        { type: "h2", text: "Tổng quan" },
        { type: "p", text: "Giải pháp kinh tế, hiệu quả chỉnh khớp cắn và sắp xếp răng mọc lệch." },
      ],
    },
  },
  {
    id: "ortho-ceramic",
    title: "Niềng răng mắc cài sứ",
    slug: "nieng-rang-mac-cai-su",
    categorySlug: "nieng-rang",
    category: "Niềng răng",
    image: "/images/services/nieng_rang_mac_cai_su.png",
    priceMin: 28000000, priceMax: 38000000,
    discountPercent: 8,
    tags: ["thẩm mỹ", "khuyến mãi"],
    detail: {
      gallery: ["/images/services/ortho-ceramic.jpg"],
      unit: "Liệu trình",
      shortNotes: "Màu khí cụ gần tự nhiên, phù hợp môi trường giao tiếp.",
      ctas: { phone: "19008059", bookingUrl: "/dat-lich?service=ortho-ceramic" },
      content: [
        { type: "h2", text: "Ưu điểm" },
        { type: "ul", items: ["Ít lộ khí cụ", "Tính thẩm mỹ cao", "Hiệu quả chỉnh nha tốt"] },
      ],
    },
  },
  {
    id: "ortho-invisalign",
    title: "Niềng răng Invisalign (khay trong)",
    slug: "nieng-rang-invisalign",
    categorySlug: "nieng-rang",
    category: "Niềng răng",
    image: "/images/services/khay_trong.jpg",
    priceMin: 70000000, priceMax: 120000000,
    discountPercent: 10,
    tags: ["cao cấp", "bán chạy", "khuyến mãi"],
    detail: {
      gallery: ["/images/services/nieng_rang_trong_suot.png"],
      unit: "Liệu trình",
      shortNotes: "Tháo lắp tiện lợi, vệ sinh dễ, gần như vô hình.",
      ctas: { phone: "19008059", bookingUrl: "/dat-lich?service=invisalign" },
      content: [
        { type: "h2", text: "Vì sao chọn Invisalign?" },
        { type: "ul", items: ["Thẩm mỹ tối đa", "Ít đau, ít kích ứng", "Dễ vệ sinh, ăn uống thoải mái"] },
      ],
    },
  },

  // ========= NHA KHOA TỔNG QUÁT =========
  {
    id: "gen-fill",
    title: "Trám răng thẩm mỹ",
    slug: "tram-rang-tham-my",
    categorySlug: "nha-khoa-tong-quat",
    category: "Nha khoa tổng quát",
    image: "/images/services/tram_rang_tham_my.jpg",
    price: 400000,
    discountPercent: 5,
    tags: ["phổ biến", "khuyến mãi"],
    detail: {
      gallery: ["/images/services/tram_rang_tham_my.jpg"],
      unit: "Răng",
      shortNotes: "Vật liệu composite màu răng, an toàn & thẩm mỹ.",
      ctas: { phone: "19008059", bookingUrl: "/dat-lich?service=gen-fill" },
      content: [
        { type: "h2", text: "Khi nào cần trám?" },
        { type: "ul", items: ["Sâu răng nhỏ", "Mẻ – vỡ góc răng", "Thẩm mỹ mặt răng"] },
      ],
    },
  },
  {
    id: "gen-scaling",
    title: "Lấy cao răng – đánh bóng",
    slug: "lay-cao-rang",
    categorySlug: "nha-khoa-tong-quat",
    category: "Nha khoa tổng quát",
    image: "/images/services/lay_cao_rang.jpg",
    price: 200000,
    discountPercent: 0,
    tags: ["phòng ngừa"],
    detail: {
      gallery: ["/images/services/lay_cao_rang.jpg"],
      unit: "Lần",
      shortNotes: "Khuyến cáo 6 tháng/lần.",
      ctas: { phone: "19008059", bookingUrl: "/dat-lich?service=gen-scaling" },
      content: [
        { type: "h2", text: "Lợi ích" },
        { type: "ul", items: ["Giảm viêm nướu", "Hơi thở thơm tho", "Bề mặt răng sạch bóng"] },
      ],
    },
  },
  {
    id: "gen-whitening",
    title: "Tẩy trắng răng",
    slug: "tay-trang-rang",
    categorySlug: "nha-khoa-tong-quat",
    category: "Nha khoa tổng quát",
    image: "/images/services/tay_trang_rang.jpg",
    price: 1500000,
    discountPercent: 20,
    tags: ["bán chạy", "khuyến mãi"],
    detail: {
      gallery: ["/images/services/tay_trang_rang.jpg"],
      unit: "Lần",
      shortNotes: "Công nghệ ánh sáng lạnh, an toàn men răng.",
      ctas: { phone: "19008059", bookingUrl: "/dat-lich?service=gen-whitening" },
      content: [
        { type: "h2", text: "Hiệu quả" },
        { type: "p", text: "Sáng hơn 2–3 tông sau 1 buổi, duy trì tốt nếu chăm sóc đúng." },
      ],
    },
  },

  // ========= NHA KHOA TRẺ EM =========
  {
    id: "ped-sealant",
    title: "Trám bít hố rãnh (Sealant) cho trẻ",
    slug: "tram-bit-ho-ranh-tre-em",
    categorySlug: "nha-khoa-tre-em",
    category: "Nha khoa trẻ em",
    image: "/images/services/tram_rang_kid.jpg",
    price: 250000,
    discountPercent: 10,
    tags: ["phòng ngừa", "khuyến mãi"],
    detail: {
      gallery: ["/images/services/pedo-sealant.jpg"],
      unit: "Răng",
      shortNotes: "Phòng ngừa sâu răng răng hàm lớn vĩnh viễn.",
      ctas: { phone: "19008059", bookingUrl: "/dat-lich?service=ped-sealant" },
      content: [
        { type: "h2", text: "Vì sao cần sealant?" },
        { type: "p", text: "Hố rãnh sâu tích mảng bám, sealant che phủ giúp hạn chế vi khuẩn." },
      ],
    },
  },
  {
    id: "ped-fluoride",
    title: "Bôi fluoride dự phòng sâu răng",
    slug: "boi-fluoride-tre-em",
    categorySlug: "nha-khoa-tre-em",
    category: "Nha khoa trẻ em",
    image: "/images/services/boi_fluoride_kid.png",
    price: 150000,
    discountPercent: 0,
    tags: ["phòng ngừa"],
    detail: {
      gallery: ["/images/services/boi_fluoride_kid.png"],
      unit: "Lần",
      shortNotes: "Áp dụng theo phác đồ 3–6 tháng/lần.",
      ctas: { phone: "19008059", bookingUrl: "/dat-lich?service=ped-fluoride" },
      content: [
        { type: "h2", text: "Hiệu quả" },
        { type: "p", text: "Tăng cường men răng, giảm nguy cơ sâu răng ở trẻ." },
      ],
    },
  },
  {
    id: "ped-pulp",
    title: "Điều trị tủy răng sữa",
    slug: "dieu-tri-tuy-rang-sua",
    categorySlug: "nha-khoa-tre-em",
    category: "Nha khoa trẻ em",
    image: "/images/services/tuy_rang_sua.jpg",
    priceMin: 400000, priceMax: 800000,
    discountPercent: 5,
    tags: ["điều trị"],
    detail: {
      gallery: ["/images/services/tuy_rang_sua.jpg"],
      unit: "Răng",
      shortNotes: "Giảm đau, bảo tồn răng sữa đến khi thay răng vĩnh viễn.",
      ctas: { phone: "19008059", bookingUrl: "/dat-lich?service=ped-pulp" },
      content: [
        { type: "h2", text: "Khi nào cần?" },
        { type: "ul", items: ["Đau răng kéo dài", "Răng sữa sâu lớn", "Viêm tuỷ"] },
      ],
    },
  },
];
