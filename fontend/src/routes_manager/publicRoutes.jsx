// src/routes_manager/publicRoutes.jsx
import { lazy } from "react";
import { Route } from "react-router-dom";
import DoctorsList from "../pages/DoctorsList";
import DoctorDetail from "../pages/DoctorDetail";
import Booking from "../pages/booking/Booking";
import BookingConfirm from "../pages/booking/BookingConfirm";
// Lazy load pages
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const ServiceCategory = lazy(() => import("../pages/ServiceCategory"));
const ServiceDetail = lazy(() => import("../pages/ServiceDetail"));
const PricingPage = lazy(() => import("../pages/PricingPage"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword")); // ✅ thêm
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));   // ✅ thêm
const NotFound = lazy(() => import("../pages/NotFound"));
const BlogList = lazy(() => import("../pages/blog/BlogList"));
const BlogDetail = lazy(() => import("../pages/blog/BlogDetail"));
const PostDetail = lazy(() => import("../pages/blog/PostDetail"));
const Blog = lazy(()=>import("../pages/blog/Blog"));
const ClinicMap = lazy(() => import("../pages/ClinicMap"));
export const publicRoutes = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/gioi-thieu" element={<About />} />

    {/* Dịch vụ */}
    <Route path="/dich-vu/:category" element={<ServiceCategory />} />
    <Route path="/dich-vu/:category/:slug" element={<ServiceDetail />} />

    {/* Bảng giá */}
    <Route path="/bang-gia" element={<PricingPage />} />

    {/* Bác sĩ */}
    <Route path="/bac-si" element={<DoctorsList />} />
    <Route path="/bac-si/:slug" element={<DoctorDetail />} />

    {/* Auth */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />     {/* ✅ */}
    <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* ✅ */}

    {/* Booking */}
    <Route path="/dat-lich" element={<Booking />} />
    <Route path="/dat-lich/xac-nhan" element={<BookingConfirm />} />

    <Route path="/kien-thuc" element={<BlogList />} />
    <Route path="/kien-thuc/:slug" element={<PostDetail />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:id" element={<BlogDetail />} />
    {/* 404 */}
    <Route path="*" element={<NotFound />} />
    <Route path="/tim-phong-kham" element={<ClinicMap />} />
  </>
);
