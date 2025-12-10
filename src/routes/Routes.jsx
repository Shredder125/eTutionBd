import React from "react";
import { createBrowserRouter, Navigate, ScrollRestoration } from "react-router-dom"; 
import MainLayout from "../layout/MainLayout";
import DashboardLayout from "../layout/DashboardLayout"; 
import PrivateRoute from "./PrivateRoute"; 

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AllTutors from "../pages/AllTutors";
import Tuitions from "../pages/Tuitions";
import TuitionDetails from "../pages/TuitionDetails"; 
import TutorProfile from "../pages/TutorProfile";
import About from "../pages/About"; 
import Contact from "../pages/Contact"; 

import PostTuition from "../pages/dashboard/PostTuition";
import MyTuitions from "../pages/dashboard/MyTuitions"; 
import AppliedTutors from "../pages/dashboard/AppliedTutors"; 
import UpdateTuition from "../pages/dashboard/UpdateTuition"; 
import PaymentHistory from "../pages/dashboard/PaymentHistory"; 
import Payment from "../pages/dashboard/payment/Payment"; 
import Profile from "../pages/dashboard/Profile";       

import ManageTuitions from "../pages/dashboard/admin/ManageTuitions"; 
import ManageUsers from "../pages/dashboard/admin/ManageUsers";
import AdminStats from "../pages/dashboard/admin/AdminStats";

import MyApplications from "../pages/dashboard/tutor/MyApplications";
import UpdateApplication from "../pages/dashboard/tutor/UpdateApplication"; // <-- NEW
import TutorRevenue from "../pages/dashboard/tutor/TutorRevenue";
import OngoingTuitions from "../pages/dashboard/tutor/OngoingTuitions"; 

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollRestoration />
        <MainLayout />
      </>
    ),
    errorElement: <div className="h-screen bg-black text-white flex items-center justify-center">404 - Page Not Found</div>,
    children: [
      { path: "/", element: <Home /> },
      { path: "/tutors", element: <AllTutors /> },
      { path: "/tuitions", element: <Tuitions /> },
      { path: "/tuition/:id", element: <TuitionDetails /> },
      { path: "/tutor/:id", element: <TutorProfile /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <>
        <ScrollRestoration />
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      </>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard/post-tuition" replace /> },
      { path: "post-tuition", element: <PostTuition /> },
      { path: "my-tuitions", element: <MyTuitions /> },
      { path: "applied-tutors", element: <AppliedTutors /> },
      { path: "update-tuition/:id", element: <UpdateTuition /> },
      { path: "update-application/:id", element: <UpdateApplication /> }, // <-- NEW
      { path: "payments", element: <PaymentHistory /> },
      { path: "payment", element: <Payment /> },
      { path: "manage-tuitions", element: <ManageTuitions /> },
      { path: "manage-users", element: <ManageUsers /> },
      { path: "admin-stats", element: <AdminStats /> },
      { path: "my-applications", element: <MyApplications /> },
      { path: "ongoing-tuitions", element: <OngoingTuitions /> },
      { path: "my-revenue", element: <TutorRevenue /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "/login",
    element: (
      <>
        <ScrollRestoration />
        <Login />
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <ScrollRestoration />
        <Register />
      </>
    ),
  },
]);
