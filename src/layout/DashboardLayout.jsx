import React, { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { 
  BookOpen, 
  PlusCircle, 
  Users, 
  CreditCard, 
  User, 
  Menu, 
  X,
  LogOut
} from "lucide-react";
import { useUserAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { user, logOut } = useUserAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const studentLinks = [
    { name: "My Tuitions", path: "/dashboard/my-tuitions", icon: <BookOpen size={20} /> },
    { name: "Post New Tuition", path: "/dashboard/post-tuition", icon: <PlusCircle size={20} /> },
    { name: "Applied Tutors", path: "/dashboard/applied-tutors", icon: <Users size={20} /> },
    { name: "Payments", path: "/dashboard/payments", icon: <CreditCard size={20} /> },
    { name: "Profile", path: "/dashboard/profile", icon: <User size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      {/* --- SIDEBAR (Fixed Position) --- */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-base-300 transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 flex items-center justify-center border-b border-base-300 bg-primary/5">
            <Link to="/" className="text-xl font-bold text-primary tracking-tight">eTuitionBd</Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {studentLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/30" 
                      : "text-gray-600 hover:bg-base-200 hover:text-primary"
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Footer */}
          <div className="p-4 border-t border-base-300 bg-base-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={user?.photoURL || "https://placehold.co/100"} alt="User" />
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm truncate text-gray-800">{user?.displayName || "Student"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={() => logOut()} 
              className="btn btn-outline btn-error btn-sm w-full flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      {/* lg:ml-64 creates the space for the sidebar on desktop */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-base-300 flex items-center justify-between px-4 sticky top-0 z-40">
          <span className="font-bold text-lg text-gray-700">Dashboard</span>
          <button onClick={() => setIsSidebarOpen(true)} className="btn btn-ghost btn-circle">
            <Menu />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet /> 
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;