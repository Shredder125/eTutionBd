import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/AuthContext";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";

const NAV_LINKS = [
    { name: "Home", path: "/" },
    { name: "Tuitions", path: "/tuitions" },
    { name: "Tutors", path: "/tutors" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
];

const Navbar = () => {
    const { user, logOut } = useUserAuth(); 
    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        let ticking = false;
        let rafId = null;

        const updateScroll = () => {
            setScrolled(window.scrollY > 20);
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                rafId = requestAnimationFrame(updateScroll);
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    const closeMenu = () => setIsMobileMenuOpen(false);

    const handleLogout = async () => {
        try {
            await logOut();
            navigate("/login"); 
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const renderNavLinks = () =>
        NAV_LINKS.map((link) => (
            <li key={link.name}>
                <NavLink
                    to={link.path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg font-bold transition-all duration-300 text-sm uppercase tracking-wide ${
                            isActive
                                ? "text-cyan-300 bg-cyan-500/20 border border-cyan-500/50 shadow-lg shadow-cyan-500/30"
                                : "text-gray-300 hover:text-cyan-300 border border-transparent hover:border-cyan-500/30"
                        }`
                    }
                >
                    {link.name}
                </NavLink>
            </li>
        ));

    return (
        <nav className="fixed top-0 w-full z-50 backdrop-blur-lg border-b border-cyan-500/30">
            <div className={`transition-all duration-300 ${
                scrolled 
                    ? "bg-black/95 py-3 shadow-2xl shadow-cyan-500/20" 
                    : "bg-gradient-to-b from-black/90 to-black/70 py-4"
            }`}>
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* LEFT: LOGO & MOBILE MENU */}
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all duration-300"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        <Link
                            to="/"
                            className="text-2xl font-black text-white hover:text-cyan-400 transition-colors tracking-wider"
                        >
                            eTuitionBd
                        </Link>
                    </div>

                    {/* CENTER: DESKTOP LINKS */}
                    <ul className="hidden lg:flex items-center gap-2">
                        {renderNavLinks()}
                    </ul>

                    {/* RIGHT: AUTH */}
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/dashboard"
                                className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold rounded-lg border border-cyan-500/50 transition-all duration-300 uppercase text-sm tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
                            >
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>

                            {/* User Dropdown */}
                            <div className="dropdown dropdown-end">
                                <button
                                    tabIndex={0}
                                    className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
                                >
                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-cyan-500/50">
                                        <img
                                            alt="User Avatar"
                                            src={user.photoURL || "https://placehold.co/100/0f172a/06b6d4?text=U"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </button>
                                <ul className="dropdown-content mt-3 p-3 bg-black/95 backdrop-blur-lg border border-cyan-500/30 rounded-lg w-56 space-y-2 shadow-2xl shadow-cyan-500/20">
                                    <li className="px-4 py-2 text-sm font-bold text-cyan-400 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                                        {user.displayName || "My Account"}
                                    </li>
                                    <li>
                                        <Link to="/dashboard/profile" onClick={closeMenu} className="flex items-center gap-3 p-2 rounded-lg hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300 transition-colors font-semibold border border-transparent hover:border-cyan-500/30">
                                            <User size={18} /> Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/dashboard" onClick={closeMenu} className="flex items-center gap-3 p-2 rounded-lg hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300 transition-colors font-semibold border border-transparent hover:border-cyan-500/30">
                                            <LayoutDashboard size={18} /> Dashboard
                                        </Link>
                                    </li>
                                    <div className="divider my-2 bg-cyan-500/20"></div>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 p-2 text-red-400/80 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors font-semibold border border-transparent hover:border-red-500/30"
                                        >
                                            <LogOut size={18} /> Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link 
                                to="/login" 
                                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-bold rounded-lg border border-gray-700/50 transition-all duration-300 uppercase text-sm tracking-wide"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold rounded-lg border border-cyan-500/50 transition-all duration-300 uppercase text-sm tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* MOBILE MENU */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t border-cyan-500/30 bg-black/95 backdrop-blur-lg">
                    <div className="container mx-auto px-6 py-4">
                        <ul className="space-y-2">
                            {renderNavLinks()}
                            {user ? (
                                <>
                                    <li className="mt-4 pt-4 border-t border-cyan-500/30 space-y-2">
                                        <Link to="/dashboard" onClick={closeMenu} className="flex items-center gap-3 p-3 bg-cyan-500/20 text-cyan-300 rounded-lg font-bold border border-cyan-500/50 transition-all uppercase text-sm tracking-wide">
                                            <LayoutDashboard size={18} /> Dashboard
                                        </Link>
                                        <Link to="/dashboard/profile" onClick={closeMenu} className="flex items-center gap-3 p-3 rounded-lg hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300 transition-colors font-semibold border border-transparent hover:border-cyan-500/30">
                                            <User size={18} /> Profile
                                        </Link>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-red-400/80 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all font-semibold border border-transparent hover:border-red-500/30">
                                            <LogOut size={18} /> Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li className="mt-4 pt-4 border-t border-cyan-500/30 space-y-2">
                                    <Link to="/login" onClick={closeMenu} className="block p-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-center font-bold transition-all uppercase text-sm tracking-wide border border-gray-700/50">Log In</Link>
                                    <Link to="/register" onClick={closeMenu} className="block p-3 bg-cyan-500/20 text-cyan-300 rounded-lg text-center font-bold transition-all uppercase text-sm tracking-wide border border-cyan-500/50 shadow-lg shadow-cyan-500/20">Register</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;