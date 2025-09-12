// backend/controller/chatbotController.js
import { getChatbotReply } from "../services/chatbotService.js";
import translate from "translate-google";

/**
 * chatWithBot controller
 * - expects POST { message, lang } (lang: "vi" | "en")
 * - if lang==='en' translate input to vi, call getChatbotReply (which uses Vietnamese KB),
 *   then translate output text/card fields back to English.
 * - returns { success: true, reply }
 */
export const chatWithBot = async (req, res) => {
  try {
    let { message, lang } = req.body;
    lang = (String(lang || "vi")).toLowerCase();

    if (!message || !String(message).trim()) {
      return res.json({
        success: true,
        reply: { type: "text", text: "❗ Tin nhắn rỗng — vui lòng nhập câu hỏi." },
      });
    }

    const originalMessage = String(message);
    let inputMessage = originalMessage;

    // 1) translate input EN -> VI if needed
    if (lang === "en") {
      try {
        const t = await translate(originalMessage, { from: "en", to: "vi" });
        inputMessage = t;
        console.log(`[chatbot] translated input en->vi: "${originalMessage}" -> "${inputMessage}"`);
      } catch (err) {
        console.warn("[chatbot] translate input failed, using original EN input:", err?.message || err);
      }
    }

    // 2) call service (returns object {type, text?, data?, cards?})
    let reply = await getChatbotReply(inputMessage, req.user?._id);

    // defensive normalization
    if (!reply || typeof reply !== "object") {
      reply = { type: "text", text: String(reply || "Xin lỗi, tôi chưa hiểu.") };
    }

    // 3) translate reply back vi->en if requested
    if (lang === "en") {
      try {
        // translate text field
        if (reply.type === "text" && reply.text) {
          const t = await translate(reply.text, { from: "vi", to: "en" });
          reply.text = t;
        }

        // translate single card
        if (reply.type === "card" && reply.data) {
          if (reply.data.name) {
            reply.data.name = await translate(String(reply.data.name), { from: "vi", to: "en" });
          }
          if (reply.data.description) {
            reply.data.description = await translate(String(reply.data.description), { from: "vi", to: "en" });
          }
        }

        // translate cards list
        if (reply.type === "cards" && Array.isArray(reply.cards)) {
          if (reply.text) {
            reply.text = await translate(String(reply.text), { from: "vi", to: "en" });
          }
          for (let i = 0; i < reply.cards.length; i++) {
            const c = reply.cards[i];
            if (c.name) c.name = await translate(String(c.name), { from: "vi", to: "en" });
            if (c.description) c.description = await translate(String(c.description), { from: "vi", to: "en" });
          }
        }
        console.log("[chatbot] translated reply vi->en");
      } catch (err) {
        console.warn("[chatbot] translate output failed — returning original VI reply:", err?.message || err);
      }
    }

    console.log(`[chatbot] final reply type=${reply.type || "text"}`);
    return res.json({ success: true, reply });
  } catch (err) {
    console.error("[chatbot] chatWithBot error:", err);
    return res.status(500).json({
      success: false,
      reply: { type: "text", text: "❌ Lỗi server — vui lòng thử lại sau." },
    });
  }
};

export default chatWithBot;
