import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useUserAuth } from "../context/AuthContext";
import { 
  Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, Star, AlertCircle 
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* 1. ADVANCED VISUAL ASSETS & STYLES                                         */
/* -------------------------------------------------------------------------- */

const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-black to-black animate-spin-slow duration-[20s]" />
    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
    <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[120px] mix-blend-screen" />
  </div>
);

// 3D Tilt Wrapper
const TiltContainer = ({ children }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [5, -5]);
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

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
            className="relative perspective-1000"
        >
            {children}
        </motion.div>
    );
};

/* --- 2. MOCK DATA --- */
const TESTIMONIALS = [
  {
    id: 1,
    text: "The payment security here is unmatched. I finally feel safe managing my tuition income online.",
    name: "Rahim Ahmed",
    role: "Senior Math Tutor",
    img: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  },
  {
    id: 2,
    text: "I hired an IIT tutor for my son within 24 hours. The verification badge really builds trust.",
    name: "Mrs. Farhana",
    role: "Guardian",
    img: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  },
  {
    id: 3,
    text: "The dashboard is incredibly intuitive. Tracking classes and earnings has never been easier.",
    name: "Sajid Hasan",
    role: "Physics Tutor",
    img: "https://i.pravatar.cc/150?u=a04258a2462d826712d"
  }
];

const Login = () => {
  /* -------------------------------------------------------------------------- */
  /* 3. LOGIC (UPDATED WITH FIX)                                              */
  /* -------------------------------------------------------------------------- */
  const navigate = useNavigate();
  const location = useLocation(); 
  const { logIn, googleSignIn } = useUserAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const from = location.state?.from || "/dashboard";

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, []);

  // ✅ CRITICAL FIX: Save Google User to MongoDB
  const handleGoogleLogin = async () => {
    try {
      setError("");
      
      // 1. Firebase Login
      const result = await googleSignIn();
      const user = result.user;

      // 2. Prepare Data for MongoDB
      // Note: We default to 'student'. If they are already in DB as 'tutor', 
      // the backend check (existingUser) will ignore this and keep them as 'tutor'.
      const userInfo = {
          name: user.displayName,
          email: user.email,
          role: "student", 
          photoURL: user.photoURL || "https://placehold.co/100"
      };

      // 3. Send to Backend
      await fetch(`${import.meta.env.VITE_API_URL}/users`, { 
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(userInfo)
      });

      // 4. Navigate
      navigate(from, { replace: true });

    } catch (err) {
      console.error(err);
      setError("Failed to sign in with Google.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await logIn(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      const errorMessage = err.message.includes("auth/invalid-credential") 
        ? "Invalid email or password." 
        : err.message.replace("Firebase: ", "");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 4. RENDER (ADVANCED UI)                                                  */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center relative overflow-hidden p-4 sm:p-8">
      <AuroraBackground />

      <Link to="/" className="absolute top-8 left-8 z-50 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
        <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
            <ArrowLeft size={18} />
        </div>
        <span className="font-medium text-sm">Back to Home</span>
      </Link>

      {/* MAIN CARD CONTAINER */}
      <TiltContainer>
        <div className="relative w-full max-w-5xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[650px]">
            
            {/* --- LEFT SIDE: EDITORIAL VISUAL --- */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black overflow-hidden">
                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 pt-8">
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                        Education <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Reimagined.</span>
                    </h1>
                    <p className="text-neutral-400 text-lg max-w-xs">Join 12,000+ students and tutors on the #1 platform in India.</p>
                </div>

                {/* Floating Testimonial Card */}
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
                    
                    {/* Pagination Dots */}
                    <div className="flex gap-2 mt-6">
                        {TESTIMONIALS.map((_, idx) => (
                            <div key={idx} className={`h-1 rounded-full transition-all duration-500 ${idx === currentTestimonial ? "w-8 bg-violet-500" : "w-2 bg-neutral-700"}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE: LOGIN FORM --- */}
            <div className="relative p-8 sm:p-12 flex flex-col justify-center bg-black/40">
                {/* Glow Effect Top Right */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 blur-[60px]" />

                <div className="w-full max-w-sm mx-auto relative z-10">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-neutral-400 text-sm">Enter your credentials to access your account.</p>
                    </div>

                    <button 
                        onClick={handleGoogleLogin}
                        className="group w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3.5 px-4 rounded-xl hover:bg-neutral-200 transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] mb-6"
                    >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#050505] px-2 text-neutral-500">Or continue with email</span></div>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-3 text-sm mb-6">
                            <AlertCircle size={18} /> {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="group space-y-1">
                            <label className="text-xs font-semibold text-neutral-400 ml-1 group-focus-within:text-violet-400 transition-colors">EMAIL ADDRESS</label>
                            <div className="relative">
                                <Mail size={18} className="absolute top-3.5 left-4 text-neutral-500 group-focus-within:text-white transition-colors" />
                                <input 
                                    type="email" 
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-neutral-900/50 border border-white/10 rounded-xl focus:border-violet-500/50 focus:bg-neutral-900 focus:ring-4 focus:ring-violet-500/10 transition-all text-white placeholder-neutral-600 text-sm"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="group space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-semibold text-neutral-400 group-focus-within:text-violet-400 transition-colors">PASSWORD</label>
                                <Link to="/forgot-password" className="text-xs text-neutral-500 hover:text-white transition-colors">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <Lock size={18} className="absolute top-3.5 left-4 text-neutral-500 group-focus-within:text-white transition-colors" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required
                                    className="w-full pl-11 pr-11 py-3 bg-neutral-900/50 border border-white/10 rounded-xl focus:border-violet-500/50 focus:bg-neutral-900 focus:ring-4 focus:ring-violet-500/10 transition-all text-white placeholder-neutral-600 text-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-3.5 right-4 text-neutral-500 hover:text-white transition-colors">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:shadow-[0_0_25px_-5px_rgba(124,58,237,0.5)] transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-neutral-500 mt-8">
                        New to eTuitionIndia? <Link to="/register" className="text-white font-medium hover:text-violet-400 transition-colors underline decoration-neutral-700 underline-offset-4">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
      </TiltContainer>
    </div>
  );
};

export default Login;