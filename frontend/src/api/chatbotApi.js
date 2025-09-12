// src/api/chatbotApi.js
import api from "../api"; // this should point to src/api.js which exports axios instance

// sendMessage(message, lang) => returns { reply }
export async function sendMessage(message, lang = "vi") {
  const payload = { message, lang };
  const res = await api.post("/chatbot", payload);
  // response shape: { success: true, reply: {...} }
  if (res && res.data && res.data.success) {
    return res.data.reply;
  }
  throw new Error("chatbot API error");
}

export default { sendMessage };
