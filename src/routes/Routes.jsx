import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import DashboardLayout from "../layout/DashboardLayout"; // Import the Sidebar Layout
import PrivateRoute from "./PrivateRoute"; // Import Security Wrapper

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AllTutors from "../pages/AllTutors";

// Dashboard Pages
import PostTuition from "../pages/dashboard/PostTuition";
// Note: We will create MyTuitions in the next step, make sure the file exists or create a placeholder
import MyTuitions from "../pages/dashboard/MyTuitions"; 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    // These pages have Navbar & Footer
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/tutors",
        element: <AllTutors />,
      },
    ],
  },
  {
    // --- DASHBOARD ROUTES (Protected + Sidebar) ---
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        // This will be accessible at: /dashboard/post-tuition
        path: "post-tuition", 
        element: <PostTuition />,
      },
      {
        // This will be accessible at: /dashboard/my-tuitions
        path: "my-tuitions", 
        element: <MyTuitions />,
      },
      // You can add more dashboard pages here later (e.g., Profile, Settings)
    ],
  },
  {
    // Standalone Pages (No Navbar/Footer)
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);