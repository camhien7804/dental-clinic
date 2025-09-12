// src/routes_manager/privateRoutes.jsx
import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Admin pages
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminDoctors = lazy(() => import("../pages/admin/AdminDoctors"));
const AdminServices = lazy(() => import("../pages/admin/Services"));
const AdminInventory = lazy(() => import("../pages/admin/Inventory"));
const AdminPosts = lazy(() => import("../pages/admin/AdminPosts"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));

// Dentist pages
const DentistDashboard = lazy(() => import("../pages/dentist/Dashboard"));
const DentistAppointments = lazy(() => import("../pages/dentist/DentistAppointments"));
const DentistPatientHistory = lazy(() => import("../pages/dentist/PatientHistory"));

// Patient pages
const UserDashboard = lazy(() => import("../pages/Dashboard"));
const MyAppointments = lazy(() => import("../pages/patient/MyAppointments"));
const PatientHistory = lazy(() => import("../pages/patient/MyHistory"));

// Booking pages
const Booking = lazy(() => import("../pages/booking/Booking"));
const BookingConfirm = lazy(() => import("../pages/booking/BookingConfirm"));

export const privateRoutes = (
  <>
    {/* ----------- Admin ----------- */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute requireRole="Admin">
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/doctors"
      element={
        <ProtectedRoute requireRole="Admin">
          <AdminDoctors />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/services"
      element={
        <ProtectedRoute requireRole="Admin">
          <AdminServices />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/inventory"
      element={
        <ProtectedRoute requireRole="Admin">
          <AdminInventory />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/posts"
      element={
        <ProtectedRoute requireRole="Admin">
          <AdminPosts />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/users"
      element={
        <ProtectedRoute requireRole="Admin">
          <AdminUsers />
        </ProtectedRoute>
      }
    />

    {/* ----------- Dentist ----------- */}
    <Route
      path="/dentist"
      element={
        <ProtectedRoute requireRole="Dentist">
          <DentistDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dentist/appointments"
      element={
        <ProtectedRoute requireRole="Dentist">
          <DentistAppointments />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dentist/patient-history"
      element={
        <ProtectedRoute requireRole="Dentist">
          <DentistPatientHistory />
        </ProtectedRoute>
      }
    />

    {/* ----------- Patient ----------- */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute requireRole="Patient">
          <UserDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/patient/appointments"
      element={
        <ProtectedRoute requireRole="Patient">
          <MyAppointments />
        </ProtectedRoute>
      }
    />
    <Route
      path="/patient/history"
      element={
        <ProtectedRoute requireRole="Patient">
          <PatientHistory />
        </ProtectedRoute>
      }
    />

    {/* ----------- Booking ----------- */}
    <Route
      path="/dat-lich"
      element={
        <ProtectedRoute>
          <Booking />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dat-lich/xac-nhan"
      element={
        <ProtectedRoute>
          <BookingConfirm />
        </ProtectedRoute>
      }
    />
  </>
);
