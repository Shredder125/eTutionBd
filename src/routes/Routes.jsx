import { createBrowserRouter, Navigate } from "react-router-dom"; // <--- 1. Import Navigate
import MainLayout from "../layout/MainLayout";
import DashboardLayout from "../layout/DashboardLayout"; 
import PrivateRoute from "./PrivateRoute"; 

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AllTutors from "../pages/AllTutors";
import Tuitions from "../pages/Tuitions";

import PostTuition from "../pages/dashboard/PostTuition";
import MyTuitions from "../pages/dashboard/MyTuitions"; 
import AppliedTutors from "../pages/dashboard/AppliedTutors"; 
import UpdateTuition from "../pages/dashboard/UpdateTuition"; 

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
      // ✅ 2. ADD THIS LINE: Redirects /dashboard -> /dashboard/post-tuition
      { 
        index: true, 
        element: <Navigate to="/dashboard/post-tuition" replace /> 
      },
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