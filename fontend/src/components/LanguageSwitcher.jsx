import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => changeLanguage("vi")}
        className={`px-2 py-1 rounded ${i18n.language === "vi" ? "bg-green-600 text-white" : "bg-gray-200"}`}
      >
        🇻🇳 VI
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className={`px-2 py-1 rounded ${i18n.language === "en" ? "bg-green-600 text-white" : "bg-gray-200"}`}
      >
        🇺🇸 EN
      </button>
    </div>
  );
}
