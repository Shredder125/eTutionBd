// src/pages/Register.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useUserAuth } from "../context/AuthContext"; 
import { updateProfile } from "firebase/auth"; 
import { 
    User, Mail, Lock, Phone, Eye, EyeOff, Loader2, ArrowLeft, 
    Star, GraduationCap, BookOpen, AlertCircle 
} from "lucide-react";
// Import auth here if you need updateProfile, otherwise ensure it's imported correctly
import { auth } from "../firebase"; // Assuming this path is correct

/* -------------------------------------------------------------------------- */
/* 1. VISUAL ASSETS (Unchanged)                                               */
/* -------------------------------------------------------------------------- */

const AuroraBackground = () => (
// ... (AuroraBackground component code)
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-black to-black animate-spin-slow duration-[20s]" />
    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
    <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[120px] mix-blend-screen" />
  </div>
);

const TiltContainer = ({ children }) => {
// ... (TiltContainer component code)
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [2, -2]); 
    const rotateY = useTransform(x, [-100, 100], [-2, 2]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 200);
        y.set(yPct * 200);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            className="relative perspective-1000 w-full max-w-5xl"
        >
            {children}
        </motion.div>
    );
};

/* --- 2. MOCK TESTIMONIALS (Unchanged) --- */
const TESTIMONIALS = [
// ... (Testimonials code)
    {
        id: 1,
        text: "Joining as a tutor was the best career move. I now have a steady stream of students and reliable income.",
        name: "Ayesha Siddiqua",
        role: "English Tutor",
        img: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    },
    {
        id: 2,
        text: "As a parent, I love how easy it is to filter verified tutors based on my budget and location.",
        name: "Mr. Rahman",
        role: "Guardian",
        img: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    },
    {
        id: 3,
        text: "The platform is secure and the support team is super helpful whenever I have a query.",
        name: "Sarah Kabir",
        role: "University Student",
        img: "https://i.pravatar.cc/150?u=a04258a2462d826712d"
    }
];

// Google Logo (Unchanged)
const GoogleIcon = ({ className }) => (
// ... (GoogleIcon SVG code)
    <svg viewBox="0 0 24 24" className={className}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const Register = () => {
    /* -------------------------------------------------------------------------- */
    /* 3. LOGIC (Updated for Redirect Flow)                                       */
    /* -------------------------------------------------------------------------- */
    const navigate = useNavigate();
    const { signUp, googleSignIn } = useUserAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "student", // Default role for email/password form
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    // GOOGLE REGISTER: Now only triggers the redirect.
    const handleGoogleRegister = async () => {
        try {
            setError("");
            
            // ✅ Triggers the full page redirect. 
            // Logic to save user to MongoDB happens in GoogleRedirectHandler.jsx after the redirect returns.
            await googleSignIn(); 
            
        } catch (err) {
            console.error(err);
            // This error handles failure BEFORE the redirect occurs (e.g., Firebase config error)
            setError("Failed to start Google sign-up. Check console.");
        }
    };

    // EMAIL REGISTER: Logic remains to use selected role and navigate upon success.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            const result = await signUp(formData.email, formData.password);
            // Ensure auth is imported for updateProfile
            const user = result.user; 
            
            // Assuming auth is imported at the top of this file for updateProfile
            await updateProfile(user, { 
                displayName: formData.name,
                photoURL: "https://placehold.co/100" 
            });

            // Use the role selected by the user in the toggle
            const userInfo = {
                name: formData.name,
                email: formData.email,
                role: formData.role, // <-- Uses selected role
                phone: formData.phone,
                photoURL: "https://placehold.co/100"
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(userInfo)
            });

            const data = await response.json();

            if (data.insertedId || data.message === 'user already exists') {
                navigate("/"); 
            } else {
                setError("Failed to save user data.");
            }

        } catch (err) {
            console.error(err);
            if (err.message.includes("email-already-in-use")) setError("Email already registered.");
            else if (err.message.includes("weak-password")) setError("Password too weak (min 6 chars).");
            else setError("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    /* -------------------------------------------------------------------------- */
    /* 4. RENDER (Unchanged)                                                      */
    /* -------------------------------------------------------------------------- */
    return (
        <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center relative overflow-hidden p-4 sm:p-8">
            <AuroraBackground />

            {/* Top Left Back Button (Clean, no 'e' logo) */}
            <Link to="/" className="absolute top-8 left-8 z-50 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
                    <ArrowLeft size={18} />
                </div>
                <span className="font-medium text-sm">Back to Home</span>
            </Link>

            <TiltContainer>
                <div className="relative w-full bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[700px]">
                    
                    {/* --- LEFT SIDE: VISUALS --- */}
                    <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black overflow-hidden">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-fuchsia-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="relative z-10">
                            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                                Start Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Journey.</span>
                            </h1>
                            <p className="text-neutral-400 text-lg max-w-xs">Create an account to connect with the best tutors in the country.</p>
                        </div>

                        {/* Testimonial Card */}
                        <div className="relative z-10 mt-auto">
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={currentTestimonial}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl"
                                >
                                    <div className="flex gap-1 mb-3 text-yellow-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                    <p className="text-neutral-200 text-lg font-medium leading-relaxed mb-4">
                                        "{TESTIMONIALS[currentTestimonial].text}"
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <img src={TESTIMONIALS[currentTestimonial].img} alt="User" className="w-10 h-10 rounded-full border border-white/20" />
                                        <div>
                                            <p className="text-white text-sm font-bold">{TESTIMONIALS[currentTestimonial].name}</p>
                                            <p className="text-neutral-500 text-xs">{TESTIMONIALS[currentTestimonial].role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                            <div className="flex gap-2 mt-6">
                                {TESTIMONIALS.map((_, idx) => (
                                    <div key={idx} className={`h-1 rounded-full transition-all duration-500 ${idx === currentTestimonial ? "w-8 bg-violet-500" : "w-2 bg-neutral-700"}`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT SIDE: FORM --- */}
                    <div className="relative p-8 sm:p-12 flex flex-col justify-center bg-black/40 overflow-y-auto">
                        <div className="w-full max-w-sm mx-auto relative z-10">
                            
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                                <p className="text-neutral-400 text-sm">Join us as a Student or Tutor.</p>
                            </div>

                            {/* --- ROLE TOGGLE (ONLY FOR EMAIL/PASSWORD) --- */}
                            <div className="mb-6">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block text-center">I am registering as a</label>
                                <div className="p-1 bg-neutral-900 rounded-xl border border-white/10 grid grid-cols-2 relative">
                                    <motion.div 
                                        className="absolute top-1 bottom-1 bg-neutral-800 rounded-lg shadow-sm"
                                        initial={false}
                                        animate={{ 
                                            left: formData.role === "student" ? "4px" : "50%", 
                                            width: "calc(50% - 4px)"
                                        }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setFormData({ ...formData, role: "student" })} 
                                        className={`relative z-10 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${formData.role === "student" ? "text-white" : "text-neutral-500 hover:text-white"}`}
                                    >
                                        <BookOpen size={14} /> Student
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setFormData({ ...formData, role: "tutor" })} 
                                        className={`relative z-10 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${formData.role === "tutor" ? "text-white" : "text-neutral-500 hover:text-white"}`}
                                    >
                                        <GraduationCap size={16} /> Tutor
                                    </button>
                                </div>
                            </div>

                            {/* --- GOOGLE BUTTON (NOW FIXED TO STUDENT ROLE) --- */}
                            <button 
                                onClick={handleGoogleRegister}
                                className="group w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3.5 px-4 rounded-xl hover:bg-neutral-200 transition-all duration-300 transform hover:scale-[1.02] shadow-lg mb-6"
                            >
                                <GoogleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Sign up with Google (as Student)
                            </button>

                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#050505] px-2 text-neutral-500">Or using email (Select Role Above)</span></div>
                            </div>

                            {error && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-3 text-sm mb-6">
                                    <AlertCircle size={18} /> {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="group space-y-1">
                                    <div className="relative">
                                        <User size={18} className="absolute top-3.5 left-4 text-neutral-500 group-focus-within:text-white transition-colors" />
                                        <input type="text" required className="w-full pl-11 pr-4 py-3 bg-neutral-900/50 border border-white/10 rounded-xl focus:border-violet-500/50 focus:bg-neutral-900 text-white placeholder-neutral-600 text-sm transition-all" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                    </div>
                                </div>

                                <div className="group space-y-1">
                                    <div className="relative">
                                        <Mail size={18} className="absolute top-3.5 left-4 text-neutral-500 group-focus-within:text-white transition-colors" />
                                        <input type="email" required className="w-full pl-11 pr-4 py-3 bg-neutral-900/50 border border-white/10 rounded-xl focus:border-violet-500/50 focus:bg-neutral-900 text-white placeholder-neutral-600 text-sm transition-all" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                    </div>
                                </div>

                                <div className="group space-y-1">
                                    <div className="relative">
                                        <Phone size={18} className="absolute top-3.5 left-4 text-neutral-500 group-focus-within:text-white transition-colors" />
                                        <input type="tel" required className="w-full pl-11 pr-4 py-3 bg-neutral-900/50 border border-white/10 rounded-xl focus:border-violet-500/50 focus:bg-neutral-900 text-white placeholder-neutral-600 text-sm transition-all" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                                    </div>
                                </div>

                                <div className="group space-y-1">
                                    <div className="relative">
                                        <Lock size={18} className="absolute top-3.5 left-4 text-neutral-500 group-focus-within:text-white transition-colors" />
                                        <input type={showPassword ? "text" : "password"} required className="w-full pl-11 pr-11 py-3 bg-neutral-900/50 border border-white/10 rounded-xl focus:border-violet-500/50 focus:bg-neutral-900 text-white placeholder-neutral-600 text-sm transition-all" placeholder="Password (Min 6 chars)" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-3.5 right-4 text-neutral-500 hover:text-white transition-colors">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:shadow-[0_0_25px_-5px_rgba(124,58,237,0.5)] transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                                >
                                    {loading ? <Loader2 size={20} className="animate-spin" /> : "Create Account"}
                                </button>
                            </form>

                            <p className="text-center text-sm text-neutral-500 mt-6">
                                Already have an account? <Link to="/login" className="text-white font-medium hover:text-violet-400 transition-colors underline decoration-neutral-700 underline-offset-4">Log in</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </TiltContainer>
        </div>
    );
};

export default Register;