import React, { useEffect, useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { 
  BookOpen, PlusCircle, Users, CreditCard, User, Menu, LogOut, Shield, TrendingUp, Briefcase, DollarSign, Calendar, Zap 
} from "lucide-react";
import { useUserAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { user, userProfile, logOut } = useUserAuth(); // ✅ Use userProfile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Use role from userProfile (MongoDB), fallback to 'student'
  const userRole = userProfile?.role || 'student';
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate('/login');
  };

  // Derived states for cleaner JSX
  const isAdmin = userRole === 'admin';
  const isTutor = userRole === 'tutor';
  const isStudent = userRole === 'student';

  // Render loading state while user is loading
  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Zap className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  // ✅ Use photoURL from userProfile (MongoDB has better data than Firebase)
  const photoURL = userProfile?.photoURL || user?.photoURL || "https://placehold.co/100";
  const displayName = userProfile?.name || user?.displayName || "User";

  return (
    <div className="dashboard-container min-h-screen bg-base-200 font-sans">
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-base-300 transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-center border-b border-base-300 bg-primary/5">
            <Link to="/" className="text-xl font-bold text-primary tracking-tight">eTuitionBd</Link>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            
            {/* 🛡️ ADMIN SECTION */}
            {isAdmin && (
              <div className="mb-6">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase mb-2">Admin Controls</p>
                
                <NavLink to="/dashboard/manage-tuitions" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive ? "bg-red-50 text-red-600 shadow-sm border border-red-100" : "text-gray-600 hover:bg-gray-50 hover:text-red-600"}`}>
                  <Shield size={20} /> <span>Manage Tuitions</span>
                </NavLink>

                <NavLink to="/dashboard/manage-users" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100" : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"}`}>
                  <Users size={20} /> <span>Manage Users</span>
                </NavLink>

                <NavLink to="/dashboard/admin-stats" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive ? "bg-purple-50 text-purple-600 shadow-sm border border-purple-100" : "text-gray-600 hover:bg-gray-50 hover:text-purple-600"}`}>
                  <TrendingUp size={20} /> <span>Reports & Analytics</span>
                </NavLink>

                <div className="divider my-2"></div>
              </div>
            )}
            
            {/* 🎓 TUTOR SECTION */}
            {isTutor && (
              <div className="mb-6">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase mb-2">Tutor Menu</p>
                
                <NavLink to="/dashboard/my-applications" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`}>
                  <Briefcase size={20} /> <span>My Applications</span>
                </NavLink>

                <NavLink to="/dashboard/ongoing-tuitions" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? "bg-cyan-50 text-cyan-600" : "text-gray-600 hover:bg-gray-100"}`}>
                  <Calendar size={20} /> <span>Ongoing Tuitions</span>
                </NavLink>
                
                <NavLink to="/dashboard/my-revenue" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? "bg-green-50 text-green-600" : "text-gray-600 hover:bg-gray-100"}`}>
                  <DollarSign size={20} /> <span>My Income</span>
                </NavLink>

                <div className="divider my-2"></div>
              </div>
            )}

            {/* 📚 STUDENT SECTION */}
            {isStudent && (
              <div>
                <p className="px-4 text-xs font-bold text-gray-400 uppercase mb-2">Student Menu</p>
                <NavLink to="/dashboard/post-tuition" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`}>
                  <PlusCircle size={20} /> Post Tuition
                </NavLink>
                <NavLink to="/dashboard/my-tuitions" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`}>
                  <BookOpen size={20} /> My Tuitions
                </NavLink>
                <NavLink to="/dashboard/applied-tutors" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`}>
                  <Users size={20} /> Applied Tutors
                </NavLink>
                <NavLink to="/dashboard/payments" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`}>
                  <CreditCard size={20} /> Payments
                </NavLink>
              </div>
            )}
            
            {/* Profile Link (Visible to All) */}
            <div className="divider my-2"></div>
            <NavLink to="/dashboard/profile" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${isActive ? "bg-gray-200 text-gray-800" : "text-gray-600 hover:bg-gray-100"}`}>
              <User size={20} /> <span>Profile Settings</span>
            </NavLink>
          </nav>

          <div className="p-4 border-t border-base-300 bg-base-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={photoURL} alt="User" />
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm truncate text-gray-800">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">
                  {isAdmin ? "Administrator" : isTutor ? "Tutor" : "Student"}
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="btn btn-outline btn-error btn-sm w-full flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <header className="lg:hidden h-16 bg-white border-b border-base-300 flex items-center justify-between px-4 sticky top-0 z-40">
          <span className="font-bold text-lg text-gray-700">Dashboard</span>
          <button onClick={() => setIsSidebarOpen(true)} className="btn btn-ghost btn-circle">
            <Menu />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet /> 
        </main>
      </div>

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