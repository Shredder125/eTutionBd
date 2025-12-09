import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AllTutors from "../pages/AllTutors"; // 1. Import the new page

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    // These pages WILL have Navbar & Footer
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/tutors", // 2. Add this route here
        element: <AllTutors />,
      },
    ],
  },
  {
    // This page is OUTSIDE MainLayout, so NO Navbar/Footer
    path: "/login",
    element: <Login />,
  },
  {
    // This page is OUTSIDE MainLayout, so NO Navbar/Footer
    path: "/Register",
    element: <Register />,
  },
]);