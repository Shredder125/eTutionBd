import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom"; 
import MainLayout from "../layout/MainLayout";
import DashboardLayout from "../layout/DashboardLayout"; 
import PrivateRoute from "./PrivateRoute"; 

// Public Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AllTutors from "../pages/AllTutors";
import Tuitions from "../pages/Tuitions";

// Dashboard Pages (Student)
import PostTuition from "../pages/dashboard/PostTuition";
import MyTuitions from "../pages/dashboard/MyTuitions"; 
import AppliedTutors from "../pages/dashboard/AppliedTutors"; 
import UpdateTuition from "../pages/dashboard/UpdateTuition"; 
import PaymentHistory from "../pages/dashboard/PaymentHistory"; 
import Payment from "../pages/dashboard/payment/Payment";       

// Dashboard Pages (Admin)
import ManageTuitions from "../pages/dashboard/admin/ManageTuitions"; 
import ManageUsers from "../pages/dashboard/admin/ManageUsers";
import AdminStats from "../pages/dashboard/admin/AdminStats";

// Dashboard Pages (Tutor)
import MyApplications from "../pages/dashboard/tutor/MyApplications"; // ✅ NEW IMPORT

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/tutors",
        element: <AllTutors />,
      },
      {
        path: "/tuitions",
        element: <Tuitions />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Default Redirect
      { 
        index: true, 
        element: <Navigate to="/dashboard/post-tuition" replace /> 
      },
      // Student Routes
      {
        path: "post-tuition", 
        element: <PostTuition />,
      },
      {
        path: "my-tuitions", 
        element: <MyTuitions />,
      },
      {
        path: "applied-tutors", 
        element: <AppliedTutors />, 
      },
      {
        path: "update-tuition/:id", 
        element: <UpdateTuition />, 
      },
      {
        path: "payments", 
        element: <PaymentHistory />, 
      },
      {
        path: "payment", 
        element: <Payment />, 
      },
      // Admin Routes
      {
        path: "manage-tuitions", 
        element: <ManageTuitions />, 
      },
      {
        path: "manage-users", 
        element: <ManageUsers />, 
      },
      {
        path: "admin-stats", 
        element: <AdminStats />, 
      },
      // ✅ NEW: Tutor Route
      {
        path: "my-applications", 
        element: <MyApplications />, 
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);