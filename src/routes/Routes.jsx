import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AllTutors from "../pages/AllTutors";
import MyTuitions from "../pages/MyTuitions"; // 1. Import the new page
import PostTuition from "../pages/dashboard/PostTuition";

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
        path: "/tutors",
        element: <AllTutors />,
      },
      {
        path: "/my-tuitions", // 2. Add the MyTuitions route here
        element: <MyTuitions />,
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