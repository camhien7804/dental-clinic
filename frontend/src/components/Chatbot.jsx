// src/components/Chatbot.jsx
import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../api/chatbotApi";
import { MessageCircle, X, Volume2, Mic, Globe, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatbot_history");
    return saved
      ? JSON.parse(saved)
      : [
          {
            sender: "bot",
            type: "text",
            text: "👋 Xin chào! Tôi là <b>Trợ lý nha sĩ AI</b> 🦷. Bạn muốn hỏi gì?",
          },
        ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState("vi");
  const [listening, setListening] = useState(false);
  const endRef = useRef(null);

  const suggestions = {
    vi: [
      "Làm sao để đặt lịch?",
      "Bảng giá dịch vụ",
      "Tôi muốn niềng răng",
      "Tôi có răng khôn mọc lệch",
      "Tẩy trắng răng bao lâu thì trắng?",
      "Có hỗ trợ bảo hiểm không?",
      "mẹo",
      "quiz",
    ],
    en: [
      "How to book an appointment?",
      "Service price list",
      "I want braces",
      "I have wisdom tooth pain",
      "How long does whitening last?",
      "Do you support insurance?",
      "tips",
      "quiz",
    ],
  };

  // persist
  useEffect(() => {
    localStorage.setItem("chatbot_history", JSON.stringify(messages));
  }, [messages]);

  // auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // TTS (only when pressing speaker button)
  const speak = (text) => {
    if (!text) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g, ""));
      u.lang = lang === "en" ? "en-US" : "vi-VN";
      window.speechSynthesis.speak(u);
    }
  };

  // voice input (webkitSpeechRecognition)
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt không hỗ trợ voice input.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === "en" ? "en-US" : "vi-VN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognition.start();
  };

  // handle send & typing effect
  const handleSend = async (presetText) => {
    const text = (presetText ?? input ?? "").trim();
    if (!text) return;
    // push user message
    setMessages((prev) => [...prev, { sender: "user", type: "text", text }]);
    setLoading(true);

    try {
      // call backend, lang param
      const reply = await sendMessage(text, lang);
      // reply is { type, text?, data?, cards? }
      if (!reply || typeof reply !== "object") {
        setMessages((prev) => [...prev, { sender: "bot", type: "text", text: "⚠️ Lỗi: không nhận được phản hồi." }]);
        return;
      }

      // typing effect for text reply
      if (reply.type === "text") {
        const full = reply.text || "";
        // push placeholder bot typing
        setMessages((prev) => [...prev, { sender: "bot", type: "text", text: "", isTyping: true }]);
        let idx = 0;
        const timer = setInterval(() => {
          idx++;
          setMessages((prev) => {
            const newM = [...prev];
            const last = newM[newM.length - 1];
            if (last && last.sender === "bot" && last.isTyping) {
              last.text = full.slice(0, idx);
            }
            return newM;
          });
          if (idx >= full.length) {
            clearInterval(timer);
            setMessages((prev) => {
              const newM = [...prev];
              const last = newM[newM.length - 1];
              if (last) last.isTyping = false;
              return newM;
            });
          }
        }, 20);
      } else if (reply.type === "card") {
        setMessages((prev) => [...prev, { sender: "bot", type: "card", data: reply.data }]);
      } else if (reply.type === "cards") {
        setMessages((prev) => [...prev, { sender: "bot", type: "cards", text: reply.text, cards: reply.cards }]);
      } else {
        // unknown type: show text fallback
        setMessages((prev) => [...prev, { sender: "bot", type: "text", text: reply.text || "Xin lỗi, tôi chưa hiểu." }]);
      }
    } catch (err) {
      console.error("chatWithBot error:", err);
      setMessages((prev) => [...prev, { sender: "bot", type: "text", text: "⚠️ Xin lỗi, hiện không thể trả lời. Vui lòng thử lại." }]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const clearChat = () => {
    localStorage.removeItem("chatbot_history");
    setMessages([
      {
        sender: "bot",
        type: "text",
        text: "👋 Xin chào! Tôi là <b>Trợ lý nha sĩ AI</b> 🦷. Bạn muốn hỏi gì?",
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* floating button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-600 to-emerald-400 text-white flex items-center justify-center shadow-xl"
          title="Chat với trợ lý"
        >
          <MessageCircle size={26} />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-96 rounded-2xl flex flex-col overflow-hidden shadow-2xl bg-white border"
          >
            {/* header */}
            <div className="bg-gradient-to-r from-green-700 to-emerald-500 text-white px-4 py-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-bold">🤖 Trợ lý Nha Sĩ AI</span>
                <span className="text-xs opacity-80">— thân thiện & chuyên nghiệp</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLang((l) => (l === "vi" ? "en" : "vi"))}
                  title="Đổi ngôn ngữ"
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <Globe size={16} />
                </button>
                <button onClick={clearChat} title="Xoá lịch sử" className="p-1 hover:bg-white/10 rounded">
                  <Trash2 size={16} />
                </button>
                <button onClick={() => setIsOpen(false)} title="Đóng" className="p-1 hover:bg-white/10 rounded">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm max-h-[380px]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[78%] whitespace-pre-wrap shadow-sm ${
                      msg.sender === "user" ? "bg-green-100" : "bg-gray-50 border border-green-100"
                    }`}
                  >
                    {msg.type === "text" && (
                      <div className="flex items-start gap-2">
                        <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                        {msg.sender === "bot" && !msg.isTyping && (
                          <button onClick={() => speak(msg.text)} className="text-gray-400 hover:text-green-500">
                            <Volume2 size={14} />
                          </button>
                        )}
                        {msg.isTyping && (
                          <div className="ml-2 flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-150 ml-1"></span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-300 ml-1"></span>
                          </div>
                        )}
                      </div>
                    )}

                    {msg.type === "card" && msg.data && (
                      <div className="space-y-2 w-72">
                        <img src={msg.data.image} alt={msg.data.name} className="w-full h-32 object-cover rounded-lg" />
                        <div className="font-semibold">{msg.data.name}</div>
                        <div className="text-xs text-gray-600">{msg.data.description}</div>
                        <div className="text-green-600 font-bold">{msg.data.price}</div>
                        <a href={msg.data.link} className="block text-center bg-green-600 text-white py-1 rounded-lg hover:bg-green-700">
                          {lang === "en" ? "Book" : "Đặt lịch"}
                        </a>
                      </div>
                    )}

                    {msg.type === "cards" && (
                      <div className="space-y-2 w-80">
                        {msg.text && <div className="font-medium">{msg.text}</div>}
                        <div className="grid grid-cols-1 gap-2">
                          {msg.cards.map((c, idx) => (
                            <div key={idx} className="flex gap-2 border rounded p-2 bg-white">
                              <img src={c.image} alt={c.name} className="w-20 h-16 object-cover rounded" />
                              <div className="flex-1">
                                <div className="font-semibold text-sm">{c.name}</div>
                                <div className="text-xs text-gray-600">{c.description}</div>
                                <div className="text-green-600 font-semibold text-sm">{c.price}</div>
                                <a href={c.link} className="inline-block mt-1 text-xs bg-green-600 text-white px-2 py-1 rounded">
                                  {lang === "en" ? "Book" : "Đặt lịch"}
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex items-center space-x-2 text-gray-400">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                  <span className="text-xs">Đang xử lý...</span>
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* input area */}
            <div className="border-t p-2 bg-white">
              <div className="flex gap-2">
                <input
                  className="flex-1 p-2 outline-none text-sm rounded"
                  placeholder={lang === "en" ? "Type a message..." : "Nhập tin nhắn..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={() => handleSend()} className="bg-green-600 text-white px-3 py-1 rounded">
                  {lang === "en" ? "Send" : "Gửi"}
                </button>
                <button onClick={startListening} title="Voice input" className={`px-2 ${listening ? "text-red-500" : "text-gray-500"}`}>
                  <Mic size={18} />
                </button>
              </div>

              {/* quick suggestions */}
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestions[lang].map((s, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleSend(s)}
                    whileHover={{ scale: 1.03 }}
                    className="px-3 py-1 text-xs bg-green-50 hover:bg-green-100 rounded-full border"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
