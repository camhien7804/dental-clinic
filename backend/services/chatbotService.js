// backend/services/chatbotService.js
// Chatbot logic (read-only DB). RULES embedded for reliability.
// Exports: getChatbotReply(message, userId = null)
// Return shape:
//  { type: "text", text: "..." }
//  { type: "card", data: { name, description, price, image, link } }
//  { type: "cards", text: "...", cards: [ { name, description, price, image, link } ] }

import Service from "../models/Service.js";
import Appointment from "../models/Appointment.js";
import Post from "../models/Post.js";

/* ---------------- RULES (embedded JSON-like) ----------------
   Edit here to add/remove keywords, answers, suggested services.
*/
const RULES = {
  faq: [
    { keywords: ["giờ làm", "thời gian mở cửa", "mở cửa mấy giờ", "time open", "working hours"], answer: "⏰ Phòng khám mở cửa từ 8:00 – 20:00, tất cả các ngày trong tuần. Ngoài giờ xin gọi hotline để hỗ trợ." },
    { keywords: ["địa chỉ", "ở đâu", "vị trí", "where are you", "address"], answer: "📍 123 Đường ABC, Quận 3, TP.HCM. Có bãi đỗ xe phía sau tòa nhà." },
    { keywords: ["hotline", "số điện thoại", "call", "phone"], answer: "📞 Hotline: 0909-123 (Zalo/Viber cũng hoạt động)." },
    { keywords: ["bảo hiểm", "insurance", "hỗ trợ bảo hiểm", "bảo lãnh"], answer: "📑 Chúng tôi hỗ trợ xuất hóa đơn cho bảo hiểm y tế và bảo hiểm tư nhân — xin mang theo hồ sơ khi tới." },
    { keywords: ["thanh toán", "payment", "trả góp", "installment"], answer: "💳 Chấp nhận tiền mặt, thẻ (Visa/Master), và trả góp 0% cho gói dịch vụ lớn thông qua ngân hàng đối tác." },
    { keywords: ["website", "mạng xã hội", "facebook", "instagram"], answer: "🌐 Theo dõi chúng tôi trên Facebook/Instagram @DentalClinicExample để cập nhật khuyến mãi và kiến thức nha khoa." }
  ],

  symptoms: [
    { keywords: ["đau răng", "nhức răng", "toothache", "rang dau", "nhuc rang"], reply: "🤕 Có thể là sâu răng, viêm tủy hoặc áp xe. Cần khám sớm để chẩn đoán: Khám tổng quát hoặc Nội nha (chữa tủy).", services: ["Khám tổng quát", "Chữa tủy"] },
    { keywords: ["ê buốt", "e buot", "sensitive teeth", "nước lạnh", "buốt"], reply: "⚡ Ê buốt khi gặp lạnh/đường ăn thường do lộ ngà hoặc mòn men. Khuyến nghị: kiểm tra, trám hoặc bồi phục.", services: ["Trám răng", "Khám tổng quát"] },
    { keywords: ["răng khôn", "rang khon", "wisdom tooth", "răng khôn mọc lệch", "khôn mọc"], reply: "😖 Răng khôn mọc lệch/ngầm thường cần can thiệp (nhổ răng khôn). Có thể cần chụp X-quang trước.", services: ["Nhổ răng khôn", "Chụp X-quang"] },
    { keywords: ["răng vàng", "ố vàng", "vang rang", "yellow teeth"], reply: "😁 Răng vàng thường do mảng bám/đồ uống/thuốc. Giải pháp: lấy cao + tẩy trắng chuyên nghiệp.", services: ["Lấy cao răng", "Tẩy trắng răng"] },
    { keywords: ["hôi miệng", "hoi mieng", "bad breath"], reply: "😶 Hôi miệng có thể do mảng bám, sâu răng hoặc tiêu hoá. Khám sẽ xác định nguyên nhân và hướng điều trị.", services: ["Khám tổng quát", "Lấy cao răng"] },
    { keywords: ["sưng lợi", "lợi sưng", "bleeding gums", "lợi chảy máu"], reply: "🩺 Sưng hoặc chảy máu lợi có thể do viêm lợi/nha chu. Cần cạo vôi và tư vấn điều trị nha chu.", services: ["Cạo vôi/ lấy cao răng", "Điều trị nha chu"] },
    { keywords: ["rụng răng", "lung lay", "răng lung lay"], reply: "⚠️ Răng lung lay có thể do nha chu nặng hoặc chấn thương. Hãy đưa tới khám sớm để bảo tồn răng nếu có thể.", services: ["Khám tổng quát", "Điều trị nha chu"] },
    { keywords: ["nứt răng", "rang nut", "cracked tooth"], reply: "🔍 Răng nứt cần chụp X-quang và đánh giá — xử lý có thể là trám, bọc sứ hoặc điều trị nội nha.", services: ["Chụp X-quang", "Trám răng", "Bọc răng sứ"] },
    { keywords: ["áp xe", "abscess", "sốt răng"], reply: "🔥 Áp xe kèm sốt/đau nặng là cấp cứu nha khoa. Hãy tới phòng khám ngay hoặc gọi hotline.", services: ["Khám tổng quát", "Chữa tủy", "Nhổ răng"] }
  ],

  pricing: [
    { keywords: ["bảng giá", "bang gia", "giá dịch vụ", "price list"], answer: "📋 Mình sẽ gửi bảng giá tóm tắt — FE sẽ lấy trực tiếp từ hệ thống và hiển thị card kèm nút Đặt lịch." }
  ],

  booking: [
    { keywords: ["đặt lịch", "dat lich", "lịch hẹn", "booking", "book appointment"], answer: "👉 Bạn có thể đặt lịch tại /dat-lich hoặc gọi hotline 0909-123-456. Muốn mình giúp đặt ngay không?" }
  ],

  orthodontics: [
    { keywords: ["niềng", "nieng", "braces", "niềng răng"], reply: "😬 Niềng răng (chỉnh nha) có nhiều lựa chọn: mắc cài kim loại, mắc cài sứ, Invisalign, mặt trong. Cần khám để lên phác đồ.", services: ["Niềng răng kim loại", "Niềng răng sứ", "Niềng răng trong suốt Invisalign"] },
    { keywords: ["niềng đau", "niềng có đau", "nieng dau"], reply: "🙂 Ban đầu có cảm giác ê/khó chịu, thường giảm sau vài ngày. Bác sĩ có thể tư vấn thuốc giảm đau nếu cần." }
  ],

  whitening: [
    { keywords: ["tẩy trắng", "tay trang", "whitening", "trắng răng"], reply: "📖 Tẩy trắng tại phòng khám thường có hiệu quả sau 1 lần, duy trì 1–2 năm tùy chế độ ăn. Có thể kết hợp tại nhà để duy trì.", services: ["Tẩy trắng răng", "Lấy cao răng"] }
  ],

  pedodontics: [
    { keywords: ["trẻ em", "trám răng sữa", "nhổ răng sữa", "nha khoa trẻ em"], reply: "🧒 Chúng tôi có gói khám & điều trị cho trẻ: trám răng sữa, nhổ răng sữa, fluoride và tư vấn dinh dưỡng.", services: ["Khám nha khoa trẻ em", "Trám răng sữa", "Nhổ răng sữa", "Fluoride chống sâu răng"] }
  ],

  emergency: [
    { keywords: ["cấp cứu", "khẩn cấp", "emergency", "gãy răng"], reply: "🚨 Nếu chảy nhiều máu/đau dữ dội/gãy lớn — xin vui lòng đến phòng khám ngay hoặc gọi hotline để được hướng dẫn xử lý." }
  ],

  finance: [
    { keywords: ["khuyến mãi", "giảm giá", "promotion", "discount"], reply: "🎁 Chúng tôi có chương trình khuyến mãi theo tháng. Muốn mình kiểm tra khuyến mãi hiện tại không?" },
    { keywords: ["bảo hành", "warranty"], reply: "🔧 Các dịch vụ phục hình có chính sách bảo hành rõ ràng — cung cấp hợp đồng bảo hành khi hoàn tất điều trị." }
  ],

  tips: [
    "💡 Đánh răng sau ăn 30 phút để tránh mòn men.",
    "🦷 Dùng chỉ nha khoa mỗi ngày để bảo vệ kẽ răng.",
    "🥤 Hạn chế nước ngọt có ga & cà phê để giảm ố vàng.",
    "😴 Nếu nghiến răng khi ngủ, hãy cân nhắc làm máng chống nghiến.",
    "🍏 Thêm trái cây giòn (táo, cà rốt) giúp làm sạch tự nhiên."
  ],

  smalltalk: [
    { keywords: ["xin chào", "hello", "hi", "chào"], answer: "👋 Xin chào! Tôi là Trợ lý nha sĩ AI 🦷. Bạn cần tư vấn gì hôm nay?" },
    { keywords: ["cảm ơn", "thank you", "thanks"], answer: "🙏 Rất vui được giúp bạn — chúc bạn một ngày nhiều nụ cười!" },
    { keywords: ["tạm biệt", "bye", "goodbye"], answer: "👋 Tạm biệt! Hẹn gặp lại bạn tại phòng khám." },
    { keywords: ["bạn là ai", "tên bạn", "who are you"], answer: "🤖 Mình là trợ lý nha sĩ AI, hỗ trợ tư vấn, gợi ý dịch vụ và dẫn tới Đặt lịch." },
    { keywords: ["kể chuyện cười", "joke", "đùa"], answer: "😄 Vì sao răng không sợ ma? Vì chúng có 'men' sắt! (hehe)" }
  ],

  fallbackHints: [
    "Bạn có thể hỏi: 'Làm sao để đặt lịch?', 'Bảng giá dịch vụ', 'Tôi bị đau răng', 'Niềng răng có đau không?'.",
    "Hoặc chọn 1 câu gợi ý nhanh ở UI để mình hỗ trợ ngay."
  ]
};

/* ------------- Utilities ------------- */
const normalize = (s = "") =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const tokenize = (s = "") =>
  normalize(s)
    .split(/[^a-z0-9\u00c0-\u017f]+/g)
    .filter(Boolean);

const short = (txt = "", max = 160) => (txt && txt.length > max ? txt.slice(0, max) + "…" : (txt || ""));

const formatVND = (n) => {
  const v = Number(n || 0) || 0;
  return v.toLocaleString("vi-VN") + " VND";
};

const makeCard = (svc = {}) => ({
  name: svc.name || "Dịch vụ",
  description: short(svc.title || svc.description || "Mô tả dịch vụ."),
  price:
    (svc.minPrice === svc.maxPrice)
      ? formatVND(svc.minPrice)
      : `${formatVND(svc.minPrice)} - ${formatVND(svc.maxPrice)}`,
  image: svc.image || "/images/default-service.jpg",
  link: `/dat-lich?service=${svc.slug || svc._id}`
});

// robust kw match: keyword may be phrase or array; returns true if ALL tokens of keyword are included in msgTokens
function kwMatches(msgNorm, kw) {
  if (!kw) return false;
  const kwStr = Array.isArray(kw) ? kw.join(" ") : String(kw);
  const k = normalize(kwStr);
  if (!k) return false;
  if (msgNorm.includes(k)) return true; // exact substring match fast path
  const kTokens = tokenize(k);
  if (!kTokens.length) return false;
  const msgTokens = tokenize(msgNorm);
  // require all tokens in keyword to be present in message tokens
  return kTokens.every(t => msgTokens.includes(t));
}

// Score a service against user message (token overlap + name/slug/code matches)
function scoreService(msg, svc) {
  const nmsg = normalize(msg);
  let score = 0;
  const fields = [
    svc.name || "",
    svc.slug || "",
    svc.code || "",
    svc.title || "",
    svc.category || "",
    ...(svc.tags || [])
  ];
  for (const f of fields) {
    const nf = normalize(String(f || ""));
    if (!nf) continue;
    if (nmsg.includes(nf)) score += 6;
    const fTokens = tokenize(nf);
    for (const t of fTokens) {
      if (t.length < 3) continue;
      if (nmsg.includes(t)) score += 1.1;
    }
  }
  // boost active services modestly
  if (svc.isActive) score += 0.2;
  return score;
}

/* ------------- Main function ------------- */

export async function getChatbotReply(message, userId = null) {
  try {
    const raw = String(message || "");
    const msg = raw.trim();
    const nmsg = normalize(msg);

    if (!nmsg) {
      return { type: "text", text: "❗ Vui lòng nhập câu hỏi." };
    }

    console.log("[chatbotService] incoming:", msg);

    // 1) smalltalk (high priority)
    for (const s of RULES.smalltalk || []) {
      for (const k of s.keywords || []) {
        if (kwMatches(nmsg, k)) {
          return { type: "text", text: s.answer };
        }
      }
    }

    // 2) FAQ
    for (const f of RULES.faq || []) {
      for (const k of f.keywords || []) {
        if (kwMatches(nmsg, k)) {
          return { type: "text", text: f.answer };
        }
      }
    }

    // 3) booking triggers (many forms)
    const bookingTriggers = ["dat lich", "dat-lich", "datlich", "đặt lịch", "book appointment", "book", "đặt lịch giúp"];
    for (const t of bookingTriggers) {
      if (nmsg.includes(normalize(t))) {
        return {
          type: "card",
          data: {
            name: "Đặt lịch khám",
            description: "Bạn có thể đặt lịch trực tuyến tại trang Đặt lịch hoặc gọi hotline 📞 0909-123-456 để được hỗ trợ.",
            image: "backend/public/images/booking.jpg",
            link: "/dat-lich"
          }
        };
      }
    }

    // 4) tips request
    if (nmsg.includes("meo") || nmsg.includes("mẹo") || nmsg.includes("tip")) {
      const pick = RULES.tips[Math.floor(Math.random() * RULES.tips.length)];
      return { type: "text", text: pick };
    }

    // 5) pricing request
    for (const p of RULES.pricing || []) {
      for (const k of p.keywords || []) {
        if (kwMatches(nmsg, k)) {
          // fetch services and show as cards
          const services = await Service.find({ isActive: true }).sort({ createdAt: -1 }).lean();
          if (!services.length) return { type: "text", text: "📋 Hiện chưa có dịch vụ nào." };
          return {
            type: "cards",
            text: "📋 Bảng giá dịch vụ:",
            cards: services.map(makeCard)
          };
        }
      }
    }

    // 6) symptoms (match and fetch suggested services from RULES)
    for (const sc of RULES.symptoms || []) {
      for (const k of sc.keywords || []) {
        if (kwMatches(nmsg, k)) {
          // find services by exact name first
          let found = [];
          if (Array.isArray(sc.services) && sc.services.length) {
            found = await Service.find({ name: { $in: sc.services }, isActive: true }).lean();
          }
          // fallback fuzzy: score across all services
          if (!found.length) {
            const all = await Service.find({ isActive: true }).lean();
            const scored = all.map(s => ({ s, score: scoreService(msg, s) }))
                              .filter(x => x.score > 2.4)
                              .sort((a,b) => b.score - a.score)
                              .map(x => x.s);
            found = scored;
          }
          if (found && found.length) {
            return { type: "cards", text: sc.reply, cards: found.map(makeCard) };
          }
          // if no service matched, return reply with booking link
          return { type: "text", text: `${sc.reply} 👉 <a href="/dat-lich">Đặt lịch</a>` };
        }
      }
    }

    // 7) domain-specific sections (orthodontics, whitening, pedo, emergency, finance)
    const domainSections = ["orthodontics", "whitening", "pedodontics", "emergency", "finance"];
    for (const sec of domainSections) {
      if (!RULES[sec]) continue;
      for (const obj of RULES[sec]) {
        for (const k of obj.keywords || []) {
          if (kwMatches(nmsg, k)) {
            const services = obj.services || [];
            if (services.length) {
              const found = await Service.find({ name: { $in: services }, isActive: true }).lean();
              if (found.length) return { type: "cards", text: obj.reply || obj.answer || "", cards: found.map(makeCard) };
            }
            return { type: "text", text: obj.reply || obj.answer || "" };
          }
        }
      }
    }

    // 8) direct service name fuzzy match (user asks specific service)
    const allServices = await Service.find({ isActive: true }).lean();
    // strict token match across service fields
    const strictMatches = allServices.filter(s => {
      const hay = [s.name, s.slug, s.code, s.category, ...(s.tags || [])].join(" ");
      return kwMatches(nmsg, hay);
    });
    if (strictMatches.length === 1) return { type: "card", data: makeCard(strictMatches[0]) };
    if (strictMatches.length > 1) return { type: "cards", text: "👉 Mình tìm thấy nhiều dịch vụ phù hợp:", cards: strictMatches.map(makeCard) };

    // scored fuzzy
    const scored = allServices.map(s => ({ s, score: scoreService(msg, s) }))
                              .filter(x => x.score > 2.4)
                              .sort((a,b) => b.score - a.score);
    if (scored.length === 1) return { type: "card", data: makeCard(scored[0].s) };
    if (scored.length > 1) return { type: "cards", text: "👉 Mình tìm thấy một vài dịch vụ phù hợp, bạn chọn nhé:", cards: scored.map(x => makeCard(x.s)) };

    // 9) knowledge posts
    try {
      const posts = await Post.find({}).lean();
      for (const p of posts) {
        if (kwMatches(nmsg, p.title) || (p.tags || []).some(t => kwMatches(nmsg, t))) {
          return { type: "text", text: `📖 ${p.title}\n${short(p.content || "")}\n👉 <a href="/kien-thuc/${p.slug || ""}">Xem chi tiết</a>` };
        }
      }
    } catch (err) {
      console.warn("[chatbotService] Post lookup failed:", err?.message || err);
    }

    // 10) appointment check
    if (nmsg.includes("lich hen") || nmsg.includes("lịch hẹn") || nmsg.includes("my appointment")) {
      if (!userId) return { type: "text", text: "🔑 Vui lòng đăng nhập để xem lịch hẹn của bạn." };
      const appt = await Appointment.findOne({ patient: userId }).sort({ startAt: -1 }).lean();
      if (!appt) return { type: "text", text: "📭 Bạn chưa có lịch hẹn nào. 👉 <a href='/dat-lich'>Đặt lịch</a>" };
      return { type: "text", text: `📅 Bạn có lịch hẹn: ${appt.service} — ${new Date(appt.startAt).toLocaleString()} — Trạng thái: ${appt.status || "chưa xác định"}` };
    }

    // 11) tips/quiz fallback if user types 'quiz' or 'meo'
    if (nmsg.includes("quiz")) {
      const question = "❓ Bao lâu nên đi khám nha khoa định kỳ?\n1) 1 năm/lần\n2) 6 tháng/lần\n3) 3 năm/lần\nGõ 1/2/3 để trả lời.";
      return { type: "text", text: question };
    }
    if (["1","2","3"].includes(nmsg)) {
      if (nmsg === "2") return { type: "text", text: "👏 Chính xác! 6 tháng/lần là hợp lý để phòng ngừa sâu răng." };
      return { type: "text", text: "🙈 Chưa chính xác, thử lại nhé!" };
    }

    // 12) quick tips if message contains tip request keywords
    if (nmsg.includes("meo") || nmsg.includes("mẹo")) {
      return { type: "text", text: RULES.tips[Math.floor(Math.random() * RULES.tips.length)] };
    }

    // Final fallback: helpful hints
    return {
      type: "text",
      text:
        "😅 Mình chưa hiểu rõ. Bạn có thể hỏi về dịch vụ (ví dụ: Niềng răng, Implant, Trám răng), triệu chứng (đau răng, ê buốt), bảng giá, hoặc gõ 'mẹo'.\n\n" +
        "Gợi ý: " + RULES.fallbackHints.join(" / ")
    };
  } catch (err) {
    console.error("[chatbotService] error:", err);
    return { type: "text", text: "❌ Lỗi hệ thống — vui lòng thử lại sau." };
  }
}

export default getChatbotReply;
