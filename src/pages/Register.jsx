import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUserAuth } from "../context/AuthContext"; // <--- IMPORT CONTEXT
import { updateProfile } from "firebase/auth"; // <--- To set the user's name
import { auth } from "../firebase"; // <--- To access current user
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowLeft, 
  Quote, 
  Star,
  GraduationCap,
  BookOpen,
  AlertCircle // <--- Added for error display
} from "lucide-react";

/* --- MOCK TESTIMONIALS --- */
const TESTIMONIALS = [
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

// Google Logo Component
const GoogleIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
  // Destructure auth functions from context
  const { signUp, googleSignIn } = useUserAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State for errors
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "student",
  });

  // Auto-scroll testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // --- GOOGLE REGISTER LOGIC ---
  const handleGoogleRegister = async () => {
    try {
      setError("");
      await googleSignIn();
      // Google doesn't provide a "Role" or "Phone" by default. 
      // You usually handle this by checking if the user exists in your DB, 
      // and if not, creating a document with default values.
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to sign up with Google.");
    }
  };

  // --- EMAIL/PASS REGISTER LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // 1. Create User in Firebase
      await signUp(formData.email, formData.password);

      // 2. Update the "Display Name" in Firebase (because signUp doesn't take a name)
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: formData.name
        });
      }

      // 3. (Optional) Send User Data to MongoDB
      // This is where you would send formData.role and formData.phone to your backend
      /* await fetch('http://localhost:5000/api/users', {
         method: 'POST',
         body: JSON.stringify({ 
            uid: auth.currentUser.uid, 
            role: formData.role, 
            phone: formData.phone 
         })
      }); 
      */

      console.log("User registered successfully");
      navigate("/"); // Redirect to home/dashboard
    } catch (err) {
      console.error(err);
      // Format Firebase errors to be user-friendly
      if (err.message.includes("email-already-in-use")) {
        setError("This email is already registered.");
      } else if (err.message.includes("weak-password")) {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message.replace("Firebase: ", ""));
      }
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
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop" 
            alt="Study Group" 
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

        {/* Testimonials */}
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

      {/* RIGHT SIDE: REGISTER FORM */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-y-auto">
        <Link to="/" className="absolute top-6 left-6 lg:hidden text-neutral-400 hover:text-white">
          <ArrowLeft size={24} />
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight">Create an Account</h2>
            <p className="mt-2 text-neutral-400">
              Join eTuitionBd to start your learning journey.
            </p>
          </div>

          {/* Social Login */}
          <button 
            type="button"
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-3 bg-white text-neutral-900 font-semibold py-3 px-4 rounded-xl hover:bg-neutral-200 transition-all duration-200 transform hover:scale-[1.01]"
          >
            <GoogleIcon className="w-5 h-5" />
            Sign up with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-neutral-950 px-2 text-neutral-500">Or register with email</span>
            </div>
          </div>

          {/* --- ERROR DISPLAY --- */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg flex items-center gap-2 text-sm animate-pulse">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* ROLE SELECTION TOGGLE */}
            <div className="p-1 bg-neutral-900 rounded-xl border border-neutral-800 grid grid-cols-2 relative mb-6">
              <motion.div 
                className="absolute top-1 bottom-1 bg-neutral-800 rounded-lg shadow-sm"
                layoutId="activeRole"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ 
                  left: formData.role === "student" ? "4px" : "50%", 
                  width: "calc(50% - 4px)",
                  right: formData.role === "tutor" ? "4px" : "auto"
                }}
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "student" })}
                className={`relative z-10 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                  formData.role === "student" ? "text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                <BookOpen size={16} /> Student / Parent
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "tutor" })}
                className={`relative z-10 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                  formData.role === "tutor" ? "text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                <GraduationCap size={18} /> Tutor
              </button>
            </div>

            {/* NAME INPUT */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-purple-500 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                className="block w-full pl-10 pr-3 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* EMAIL INPUT */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-purple-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-10 pr-3 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* PHONE INPUT */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-purple-500 transition-colors">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                required
                className="block w-full pl-10 pr-3 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            {/* PASSWORD INPUT */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-purple-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="block w-full pl-10 pr-10 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                placeholder="Create Password"
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

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-neutral-950 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 mt-4"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
              Log in instead
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;