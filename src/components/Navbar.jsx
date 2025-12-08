import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, User, Settings, LogOut, LayoutDashboard } from "lucide-react";

// --- NAV LINKS ---
const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Tuitions", path: "/tuitions" },
  { name: "Tutors", path: "/tutors" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [user, setUser] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll effect for sticky navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on link click
  const closeMenu = () => setIsMobileMenuOpen(false);

  // Render nav links
  const renderNavLinks = () =>
    NAV_LINKS.map((link) => (
      <li key={link.name}>
        <NavLink
          to={link.path}
          onClick={closeMenu}
          className={({ isActive }) =>
            `relative font-medium transition-all duration-300 group ${
              isActive
                ? "text-primary"
                : "text-base-content/80 hover:text-primary"
            }`
          }
        >
          {link.name}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
        </NavLink>
      </li>
    ));

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-base-100/80 backdrop-blur-xl border-base-200 shadow-sm py-3"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* --- LEFT: LOGO & MOBILE MENU --- */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            className="lg:hidden btn btn-ghost btn-circle p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Brand */}
          <Link
            to="/"
            className="text-2xl font-black tracking-tight flex items-center gap-1"
          >
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              eTuition
            </span>
            <span className="text-base-content">Bd</span>
          </Link>
        </div>

        {/* --- CENTER: DESKTOP LINKS --- */}
        <ul className="hidden lg:flex gap-8 text-[15px]">{renderNavLinks()}</ul>

        {/* --- RIGHT: AUTH --- */}
        {user ? (
          <div className="flex items-center gap-3">
            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              className="hidden md:flex btn btn-ghost btn-sm text-primary gap-2 font-normal"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            {/* User Dropdown */}
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar ring ring-primary/10 hover:ring-primary transition-all duration-300"
              >
                <div className="w-10 rounded-full overflow-hidden">
                  <img
                    alt="User Avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </button>
              <ul className="dropdown-content mt-3 p-2 shadow-2xl menu menu-sm bg-base-100 rounded-box w-56 gap-1 border border-base-200">
                <li className="menu-title px-4 py-2">My Account</li>
                <li>
                  <Link to="/profile" className="py-2 flex gap-3">
                    <User size={16} /> Profile
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="py-2 flex gap-3">
                    <Settings size={16} /> Settings
                  </Link>
                </li>
                <div className="divider my-0"></div>
                <li>
                  <button
                    onClick={() => setUser(false)}
                    className="py-2 text-error hover:bg-error/10 flex gap-3"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex">
              Log In
            </Link>
            <Link
              to="/register"
              className="btn btn-primary btn-sm px-6 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {/* --- MOBILE MENU --- */}
      {isMobileMenuOpen && (
        <ul className="lg:hidden mt-2 p-4 bg-base-100 border border-base-200 shadow-2xl rounded-xl flex flex-col gap-3 z-50">
          {renderNavLinks()}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
