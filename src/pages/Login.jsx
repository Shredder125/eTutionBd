import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUserAuth } from "../context/AuthContext";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowLeft, 
  Star, 
  Quote, 
  AlertCircle 
} from "lucide-react";

/* --- MOCK TESTIMONIALS DATA --- */
const TESTIMONIALS = [
  {
    id: 1,
    text: "This platform completely transformed how I manage my tuition schedule. The payments are secure, and the students are genuine.",
    name: "Rahim Ahmed",
    role: "Senior Math Tutor",
    img: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  },
  {
    id: 2,
    text: "Found a physics tutor for my son within 24 hours. The verification process gave us peace of mind.",
    name: "Mrs. Farhana",
    role: "Guardian",
    img: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  },
  {
    id: 3,
    text: "As a university student, eTuitionBd helped me find part-time income near my campus. Highly recommended!",
    name: "Sajid Hasan",
    role: "Chemistry Tutor",
    img: "https://i.pravatar.cc/150?u=a04258a2462d826712d"
  },
  {
    id: 4,
    text: "The dashboard is so logical. I can track my daughter's classes and payments all in one place.",
    name: "Kamrul Islam",
    role: "Parent",
    img: "https://i.pravatar.cc/150?u=a048581f4e29026701d"
  },
  {
    id: 5,
    text: "Finally, a platform that doesn't charge hidden fees. I love the transparency here.",
    name: "Nusrat Jahan",
    role: "English Tutor",
    img: "https://i.pravatar.cc/150?u=a04258114e29026302d"
  }
];

// Google Logo Component
const GoogleIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const { logIn, googleSignIn } = useUserAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-scroll testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, []);

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      setError("");
      await googleSignIn();
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to sign in with Google.");
    }
  };

  // Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await logIn(formData.email, formData.password);
      navigate("/");
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

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-neutral-950 text-neutral-200 font-sans selection:bg-purple-500/30">
      
      {/* LEFT SIDE: CAROUSEL & BRANDING */}
      <div className="hidden lg:relative lg:flex flex-col justify-between p-12 bg-neutral-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
            alt="Library" 
            className="w-full h-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-purple-900/30" />
        </div>

        {/* Brand Header */}
        <div className="relative z-10 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <span className="text-sm font-bold text-white">e</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">eTuitionBd</span>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative z-10 min-h-[200px]">
          <Quote className="text-purple-500 mb-4 opacity-50" size={40} />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <blockquote className="text-2xl font-medium text-white leading-relaxed">
                "{TESTIMONIALS[currentTestimonial].text}"
              </blockquote>
              
              <div className="flex items-center gap-4">
                <img 
                  src={TESTIMONIALS[currentTestimonial].img} 
                  alt={TESTIMONIALS[currentTestimonial].name} 
                  className="h-12 w-12 rounded-full border-2 border-purple-500/50 object-cover"
                />
                <div>
                  <p className="text-white font-semibold">{TESTIMONIALS[currentTestimonial].name}</p>
                  <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <span>{TESTIMONIALS[currentTestimonial].role}</span>
                    <span className="h-1 w-1 bg-neutral-600 rounded-full"></span>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Indicators */}
          <div className="flex gap-2 mt-8">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentTestimonial 
                    ? "w-8 bg-purple-500" 
                    : "w-2 bg-neutral-700 hover:bg-neutral-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-24 relative">
        <Link to="/" className="absolute top-6 left-6 lg:hidden text-neutral-400 hover:text-white">
          <ArrowLeft size={24} />
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome to eTuitionBd</h2>
            <p className="mt-2 text-neutral-400">
              Please sign in to access your personalized dashboard.
            </p>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-neutral-900 font-semibold py-3 px-4 rounded-xl hover:bg-neutral-200 transition-all duration-200 transform hover:scale-[1.01]"
          >
            <GoogleIcon className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-neutral-950 px-2 text-neutral-500">Or continue with email</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg flex items-center gap-2 text-sm animate-pulse">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-300">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-purple-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-neutral-300">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-purple-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-10 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-neutral-950 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
