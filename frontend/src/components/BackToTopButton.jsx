import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react"; // nếu chưa có: npm install lucide-react

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Giả sử chatbot luôn chiếm góc phải dưới cao 80px
  const CHATBOT_HEIGHT = 80; 
  const CHATBOT_MARGIN = 20; // khoảng cách giữa nút và chatbot

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed p-3 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition-all"
          style={{
            bottom: `${CHATBOT_HEIGHT + CHATBOT_MARGIN}px`, // tự động tránh chatbot
            right: "20px",
          }}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
