import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    const timer = setInterval(() => {
      if (window.google && window.google.translate) {
        clearInterval(timer);
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "vi",
            includedLanguages: "vi,en",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      }
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return <div id="google_translate_element" className="ml-2"></div>;
}
