// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  vi: {
    translation: {
      home: "Trang Chủ",
      about: "Giới Thiệu",
      pricing: "Bảng Giá",
      services: "Dịch Vụ",
      blog: "Kiến Thức Nha Khoa",
      findClinic: "Tìm Phòng Khám",
      booking: "Đặt lịch hẹn",
      implant: "Trồng răng Implant",
      braces: "Niềng răng",
      generalDentistry: "Nha khoa tổng quát",
      pediatricDentistry: "Nha khoa trẻ em",
    },
  },
  en: {
    translation: {
      home: "Home",
      about: "About Us",
      pricing: "Pricing",
      services: "Services",
      blog: "Dental Knowledge",
      findClinic: "Find Clinic",
      booking: "Book Appointment",
      implant: "Dental Implant",
      braces: "Braces",
      generalDentistry: "General Dentistry",
      pediatricDentistry: "Pediatric Dentistry",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
