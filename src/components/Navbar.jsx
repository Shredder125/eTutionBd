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

    // Smooth scroll with RAF
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
                        `px-3 py-2 rounded-lg font-medium transition-all duration-300 relative group hover:bg-primary/10 ${
                            isActive
                                ? "text-primary bg-primary/20 shadow-md"
                                : "text-neutral-300 hover:text-primary"
                        }`
                    }
                >
                    {link.name}
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-4/5"></span>
                </NavLink>
            </li>
        ));

    return (
        <nav className="fixed top-0 w-full z-50 backdrop-blur-2xl border-b border-neutral-800/50 shadow-2xl">
            {/* Always solid background with glass effect */}
            <div className={`transition-all duration-500 ease-out py-4 ${
                scrolled 
                    ? "bg-neutral-950/95 shadow-xl" 
                    : "bg-neutral-950/90"
            }`}>
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* LEFT: LOGO & MOBILE MENU */}
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 rounded-xl bg-neutral-900/50 hover:bg-neutral-800/50 transition-all duration-300"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        <Link
                            to="/"
                            className="text-2xl font-black tracking-tight flex items-center gap-1 bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent hover:scale-105 transition-all duration-300"
                        >
                            eTuition<span className="text-white font-normal">Bd</span>
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
                                className="hidden md:flex items-center gap-2 px-4 py-2 bg-neutral-900/50 hover:bg-primary/10 border border-neutral-800/50 text-primary font-medium rounded-xl transition-all duration-300 hover:scale-105"
                            >
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>

                            {/* User Dropdown */}
                            <div className="dropdown dropdown-end">
                                <button
                                    tabIndex={0}
                                    className="p-2 rounded-xl bg-neutral-900/50 hover:bg-neutral-800/50 ring-2 ring-neutral-700/50 hover:ring-primary/30 transition-all duration-300 hover:scale-105"
                                >
                                    <div className="w-10 h-10 rounded-2xl overflow-hidden ring-2 ring-white/20">
                                        <img
                                            alt="User Avatar"
                                            src={user.photoURL || "https://placehold.co/100/purple/white?text=U"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </button>
                                <ul className="dropdown-content mt-2 p-3 shadow-2xl bg-neutral-950/95 backdrop-blur-xl border border-neutral-800/50 rounded-2xl w-56 space-y-1">
                                    <li className="menu-title px-3 py-2 text-sm bg-neutral-900/50 rounded-xl">
                                        {user.displayName || "My Account"}
                                    </li>
                                    <li>
                                        <Link to="/dashboard/profile" onClick={closeMenu} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-900/50 transition-colors">
                                            <User size={18} /> Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/dashboard" onClick={closeMenu} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-900/50 transition-colors">
                                            <LayoutDashboard size={18} /> Dashboard
                                        </Link>
                                    </li>
                                    <div className="divider my-1 bg-neutral-800"></div>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 p-3 text-error hover:bg-error/10 rounded-xl transition-all duration-200"
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
                                className="px-6 py-2.5 bg-neutral-900/50 hover:bg-neutral-800/50 border border-neutral-800/50 text-neutral-200 font-medium rounded-xl transition-all duration-300 hover:scale-105"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="px-8 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 active:scale-95 transition-all duration-300 hover:scale-105"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* MOBILE MENU */}
            {isMobileMenuOpen && (
                <div className="lg:hidden mt-1 p-4 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800/50 shadow-2xl rounded-b-2xl animate-in slide-in-from-top-2 duration-200">
                    <ul className="space-y-2">
                        {renderNavLinks()}
                        {user ? (
                            <>
                                <li className="mt-4 pt-4 border-t border-neutral-800/50 space-y-2">
                                    <Link to="/dashboard" onClick={closeMenu} className="flex items-center gap-3 p-3 bg-neutral-900/50 rounded-xl hover:bg-primary/10 text-primary font-medium transition-all">
                                        <LayoutDashboard size={18} /> Dashboard
                                    </Link>
                                    <Link to="/dashboard/profile" onClick={closeMenu} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-900/50 transition-all">
                                        <User size={18} /> Profile
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-error hover:bg-error/10 rounded-xl transition-all">
                                        <LogOut size={18} /> Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="mt-4 pt-4 border-t border-neutral-800/50 space-y-2">
                                <Link to="/login" onClick={closeMenu} className="block p-3 bg-neutral-900/50 hover:bg-neutral-800/50 rounded-xl transition-all">Log In</Link>
                                <Link to="/register" onClick={closeMenu} className="block w-full p-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-primary/50 transition-all">
                                    Register
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
