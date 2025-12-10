import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    motion, 
    useScroll, 
    useTransform, 
    useMotionTemplate, 
    useMotionValue, 
    useSpring,
    useAnimate
} from "framer-motion";
import CountUp from "react-countup"; 
import { 
    Search, BookOpen, Users, CheckCircle, ArrowRight, ShieldCheck, Zap,
    DollarSign, MapPin, Loader2, Sparkles, Star, Quote, TrendingUp, Globe,
    UserPlus, FileSearch, Sparkle, Activity, MoveRight, Check, Clock, Briefcase,
    Code, Atom, Calculator, GraduationCap, Microscope, Palette, Scan, Fingerprint, Terminal
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Import your existing TutorCard component
import TutorCard from "../components/TutorCard"; 

/* -------------------------------------------------------------------------- */
/* UTILITIES & STYLES                                                         */
/* -------------------------------------------------------------------------- */

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const customStyles = `
  @keyframes gradient-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  @keyframes beam-scan {
    0% { top: -100%; opacity: 0; }
    50% { opacity: 1; }
    100% { top: 200%; opacity: 0; }
  }
  @keyframes ping-slow {
    75%, 100% { transform: scale(2); opacity: 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .hero-animated-bg {
    background: linear-gradient(-45deg, #020617, #2e1065, #0f172a, #083344, #4a044e);
    background-size: 400% 400%;
    animation: gradient-flow 10s ease infinite; 
  }
  .animate-shimmer {
    animation: shimmer 8s linear infinite;
  }
  .beam-line {
    animation: beam-scan 8s linear infinite;
  }
  .animate-ping-slow {
    animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

/* -------------------------------------------------------------------------- */
/* SUB-COMPONENTS                                                             */
/* -------------------------------------------------------------------------- */

// 1. SPOTLIGHT CARD 
function SpotlightCard({ children, className = "", spotlightColor = "rgba(139, 92, 246, 0.15)" }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        "group relative border border-white/10 bg-neutral-900/50 overflow-hidden rounded-xl",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

// 2. 3D TILT CARD (Hero Visual)
const TiltCard = ({ children }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    function handleMouseMove(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 200);
        y.set(yPct * 200);
    }

    function handleMouseLeave() {
        x.set(0); y.set(0);
    }

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-full aspect-square perspective-1000 group" 
        >
            <div style={{ transform: "translateZ(50px)" }} className="absolute inset-0">
                {children}
            </div>
        </motion.div>
    );
};

// 3. DYNAMIC BACKGROUND
const DynamicBackground = () => {
    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
    const color1 = useTransform(smoothProgress, [0, 0.3, 0.6, 1], ["#7c3aed", "#2563eb", "#06b6d4", "#059669"]);
    const color2 = useTransform(smoothProgress, [0, 0.3, 0.6, 1], ["#db2777", "#9333ea", "#0d9488", "#65a30d"]);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            <div className="absolute inset-0 bg-black" />
            <motion.div style={{ backgroundColor: color1, top: "-10%", left: "-10%" }} className="absolute w-[50vw] h-[50vw] rounded-full blur-[150px] opacity-20 mix-blend-screen" />
            <motion.div style={{ backgroundColor: color2, top: "20%", right: "-10%" }} className="absolute w-[40vw] h-[40vw] rounded-full blur-[150px] opacity-15 mix-blend-screen" />
            <motion.div style={{ backgroundColor: color1, bottom: "-20%", left: "20%" }} className="absolute w-[60vw] h-[40vw] rounded-full blur-[180px] opacity-10 mix-blend-screen" />
        </div>
    );
};

// 4. NOISE OVERLAY
const NoiseOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
);

/* -------------------------------------------------------------------------- */
/* NEW ADVANCED HERO COMPONENTS                                               */
/* -------------------------------------------------------------------------- */

const HeroGrid = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_100%,transparent_0%)]" />
         <div className="absolute top-0 left-1/4 w-px h-[200%] bg-gradient-to-b from-transparent via-violet-500/50 to-transparent beam-line" />
         <div className="absolute top-0 right-1/4 w-px h-[200%] bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent beam-line" style={{ animationDelay: "4s" }} />
    </div>
);

const FloatingChip = ({ text, icon: Icon, delay, top, left, right, bottom, color }) => (
    <motion.div 
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: [0, -15, 0], opacity: 1 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay }}
        className={`absolute hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl ${color} text-xs font-bold z-20`}
        style={{ top, left, right, bottom, transform: "translateZ(80px)" }}
    >
        <div className={`p-1 rounded-full bg-white/10 ${color.replace('text-', 'bg-').replace('300', '500/20')}`}>
            <Icon size={12} />
        </div>
        {text}
    </motion.div>
);

const LiveTicker = () => (
    <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm border-t border-white/5 py-3 overflow-hidden z-20 flex">
        <div className="flex items-center gap-2 px-4 border-r border-white/10 bg-neutral-900/50 z-30">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Live Matches</span>
        </div>
        <div className="flex overflow-hidden relative w-full mask-linear-fade">
             <motion.div 
                className="flex gap-8 items-center whitespace-nowrap pl-4"
                animate={{ x: ["0%", "-100%"] }}
                transition={{ duration: 25, ease: "linear", repeat: Infinity }}
             >
                {[
                    "Physics Tutor matched in Indiranagar, Bangalore", 
                    "English Teacher required in Vasant Vihar, Delhi", 
                    "Math Tutor matched in Andheri West, Mumbai", 
                    "Chemistry Teacher joined from IIT Bombay",
                    "IELTS Instructor matched in Pune",
                    "Biology Tutor required in Jaipur"
                ].map((text, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-neutral-400">
                        <CheckCircle size={10} className="text-violet-500" />
                        {text}
                        <span className="text-white/20">|</span>
                    </div>
                ))}
                {[
                    "Physics Tutor matched in Indiranagar, Bangalore", 
                    "English Teacher required in Vasant Vihar, Delhi", 
                    "Math Tutor matched in Andheri West, Mumbai", 
                    "Chemistry Teacher joined from IIT Bombay"
                ].map((text, i) => (
                    <div key={`dup-${i}`} className="flex items-center gap-2 text-xs text-neutral-400">
                        <CheckCircle size={10} className="text-violet-500" />
                        {text}
                        <span className="text-white/20">|</span>
                    </div>
                ))}
             </motion.div>
        </div>
    </div>
);

/* -------------------------------------------------------------------------- */
/* MAIN PAGE                                                                  */
/* -------------------------------------------------------------------------- */

const Home = () => {
    const navigate = useNavigate();
    const [latestTuitions, setLatestTuitions] = useState([]);
    const [featuredTutors, setFeaturedTutors] = useState([]);
    const [loadingTuitions, setLoadingTuitions] = useState(true);
    const [loadingTutors, setLoadingTutors] = useState(true);
    const [impactInView, setImpactInView] = useState(false);
    
    // Fetch Data Logic
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const tRes = await fetch(`${import.meta.env.VITE_API_URL}/tuitions`);
                const tData = await tRes.json();
                
                let allTuitions = [];
                if (Array.isArray(tData)) {
                    allTuitions = tData;
                } else if (tData.result && Array.isArray(tData.result)) {
                    allTuitions = tData.result;
                }
                
                const approvedTuitions = allTuitions
                    .filter(t => t.status === 'approved')
                    .slice(0, 3);
                
                setLatestTuitions(approvedTuitions);
                setLoadingTuitions(false);

                const uRes = await fetch(`${import.meta.env.VITE_API_URL}/featured-tutors`);
                const uData = await uRes.json();
                
                const tutorsList = Array.isArray(uData) ? uData : (uData.data || []);
                setFeaturedTutors(tutorsList);
                setLoadingTutors(false);

            } catch (error) {
                console.error("Home Data Error:", error);
                setLoadingTuitions(false);
                setLoadingTutors(false);
            }
        };

        fetchHomeData();
    }, []);

    const handleJobClick = (jobId) => {
        const token = localStorage.getItem("access-token");
        if (token) {
            navigate(`/tuition/${jobId}`);
        } else {
            navigate("/login", { state: { from: `/tuition/${jobId}` } });
        }
    };

    const STEPS = [
        { icon: UserPlus, title: "Create Account", desc: "Sign up as a Student or Tutor to get your dashboard.", color: "text-violet-400", bg: "bg-violet-500/10", border: "group-hover:border-violet-500/50", shadow: "group-hover:shadow-violet-500/20" },
        { icon: FileSearch, title: "Post or Apply", desc: "Post requirements or apply to jobs matching your skills.", color: "text-fuchsia-400", bg: "bg-fuchsia-500/10", border: "group-hover:border-fuchsia-500/50", shadow: "group-hover:shadow-fuchsia-500/20" },
        { icon: Sparkle, title: "Match & Learn", desc: "Connect, confirm tuition, and start learning.", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "group-hover:border-cyan-500/50", shadow: "group-hover:shadow-cyan-500/20" }
    ];

    return (
        <div className="min-h-screen text-neutral-200 selection:bg-violet-500/30 overflow-x-hidden font-sans relative">
            <style>{customStyles}</style>
            <NoiseOverlay />
            <DynamicBackground />

            {/* --- 1. HERO SECTION (UPDATED WITH ADVANCED 3D HOVER) --- */}
            <section className="relative pt-32 pb-32 lg:pt-48 lg:pb-40 px-6 border-b border-white/5 overflow-hidden hero-animated-bg">
                <HeroGrid />
                <div className="absolute inset-0 bg-black/10 z-0" />

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    {/* Hero Text */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative z-10">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-200 text-xs font-medium mb-8 hover:bg-violet-500/20 transition-colors cursor-pointer backdrop-blur-md">
                            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span></span>
                            <span>v2.0 is live: AI Matching Engine</span><MoveRight size={12} />
                        </motion.div>

                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 leading-[0.95] drop-shadow-2xl">
                            Unlock Your <br />
                            <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">Full Potential.
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer bg-[length:200%_100%]" style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text' }} />
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-300 max-w-xl mb-10 leading-relaxed font-medium drop-shadow-md">The most advanced platform for academic excellence. Connect with top-tier tutors from IITs, AIIMS, and Top Universities in seconds.</p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Link to="/tuitions">
                                <button className="group relative w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.7)]">
                                    <span className="relative z-10 flex items-center justify-center gap-2">Find a Tutor <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" /></span>
                                </button>
                            </Link>
                            <Link to="/register"><button className="w-full sm:w-auto px-8 py-4 bg-black/20 border border-white/20 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center shadow-lg">Become a Tutor</button></Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-4">
                                {[...Array(4)].map((_, i) => (<div key={i} className={`w-10 h-10 rounded-full border-2 border-white/20 bg-neutral-800 flex items-center justify-center overflow-hidden`}><img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover opacity-90" /></div>))}
                            </div>
                            <div className="space-y-1">
                                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400 drop-shadow-sm" />)}</div>
                                <p className="text-sm text-neutral-300"><span className="text-white font-bold">4.9/5</span> from 12k+ students</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- ADVANCED 3D VISUAL CONTAINER --- */}
                    <div className="relative hidden lg:block perspective-1000 h-[600px] flex items-center justify-center">
                        
                        {/* Floating elements OUTSIDE the card for parallax depth */}
                        <FloatingChip text="Mathematics" icon={Calculator} delay={0} top="5%" right="10%" color="text-fuchsia-300" />
                        <FloatingChip text="Physics" icon={Atom} delay={1.5} bottom="15%" left="-5%" color="text-cyan-300" />
                        <FloatingChip text="Web Dev" icon={Code} delay={2.5} top="40%" right="-10%" color="text-emerald-300" />
                        
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full z-0 animate-pulse" />
                        
                        <TiltCard>
                            <div className="relative w-full h-full transform-style-3d">
                                {/* Glass/Holographic Card Background */}
                                <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 opacity-50" />
                                    {/* Matrix Rain / Grid Effect inside card */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />
                                </div>

                                {/* CARD CONTENT: Separated Layers for 3D Pop */}
                                <div className="relative h-[500px] p-8 flex flex-col justify-between z-10">
                                    
                                    {/* TOP ROW: Terminal Header & Scanner */}
                                    <div className="flex justify-between items-start" style={{ transform: "translateZ(30px)" }}>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 backdrop-blur-md">
                                            <div className="w-2 h-2 rounded-full bg-red-500" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <span className="text-[10px] text-neutral-400 font-mono ml-2">sys_match.exe</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-cyan-400">
                                            <Scan size={18} className="animate-pulse" />
                                            <span className="text-xs font-mono">SCANNING</span>
                                        </div>
                                    </div>

                                    {/* MIDDLE: Holographic Neural Core */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform: "translateZ(50px)" }}>
                                        <div className="relative w-48 h-48 flex items-center justify-center">
                                            {/* Spinning Rings */}
                                            <div className="absolute inset-0 border border-violet-500/30 rounded-full animate-spin [animation-duration:10s]" />
                                            <div className="absolute inset-4 border border-fuchsia-500/30 rounded-full animate-spin [animation-duration:15s] direction-reverse" />
                                            <div className="absolute inset-10 border-2 border-dashed border-cyan-500/40 rounded-full animate-spin [animation-duration:20s]" />
                                            
                                            {/* Center Core Pulse */}
                                            <div className="relative w-20 h-20 bg-gradient-to-br from-violet-600 to-cyan-600 rounded-full shadow-[0_0_50px_rgba(124,58,237,0.5)] flex items-center justify-center animate-float">
                                                <Fingerprint size={40} className="text-white opacity-80" />
                                                <div className="absolute inset-0 rounded-full animate-ping-slow bg-violet-400 opacity-20" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* FLOATING ELEMENTS: Pop out heavily on hover (handled by parent tilt) */}
                                    
                                    {/* Left: Terminal Log */}
                                    <motion.div 
                                        className="absolute top-28 left-6 w-48 bg-black/80 border border-white/10 rounded-lg p-3 font-mono text-[10px] text-green-400 overflow-hidden shadow-xl"
                                        style={{ transform: "translateZ(60px)" }}
                                    >
                                        <div className="flex items-center gap-2 mb-2 text-neutral-500 border-b border-white/10 pb-1"><Terminal size={10} /> <span>CONSOLE</span></div>
                                        <div className="opacity-70 space-y-1">
                                            <p>> Init_Protocol_v2</p>
                                            <p>> Loc: Indiranagar...</p>
                                            <p className="text-white">> Match Found: 98%</p>
                                            <p>> Verifying NID...</p>
                                            <span className="animate-pulse">_</span>
                                        </div>
                                    </motion.div>

                                    {/* Right: User Profile */}
                                    <motion.div 
                                        className="absolute bottom-32 right-6 bg-neutral-900/90 border border-white/10 rounded-xl p-3 flex items-center gap-3 shadow-2xl backdrop-blur-md"
                                        style={{ transform: "translateZ(70px)" }}
                                    >
                                        <div className="relative">
                                            <img src="https://i.pravatar.cc/100?img=33" className="w-10 h-10 rounded-full border border-white/20" alt="Tutor" />
                                            <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border border-black" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-neutral-400">Recommended</div>
                                            <div className="text-sm font-bold text-white">Aryan Sharma</div>
                                            <div className="text-[10px] text-cyan-400">IIT Delhi (CSE)</div>
                                        </div>
                                    </motion.div>

                                    {/* BOTTOM: Stats Bar */}
                                    <div className="mt-auto grid grid-cols-3 gap-2" style={{ transform: "translateZ(40px)" }}>
                                        {[
                                            { label: "Accuracy", val: "99.8%", color: "text-green-400" },
                                            { label: "Speed", val: "< 24h", color: "text-cyan-400" },
                                            { label: "Security", val: "AES-256", color: "text-fuchsia-400" }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
                                                <div className={`text-sm font-bold ${stat.color}`}>{stat.val}</div>
                                                <div className="text-[10px] text-neutral-500 uppercase">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TiltCard>
                    </div>
                </div>

                <LiveTicker />
            </section>

            {/* --- 2. IMPACT SECTION (UNCHANGED) --- */}
            <section className="py-24 px-6 border-b border-white/5 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_100%,transparent_0%)] pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Global Impact</span></h2>
                            <div className="flex items-center justify-center gap-2 text-neutral-400">
                                <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
                                <p className="font-mono text-sm uppercase tracking-widest">System Status: Operational</p>
                            </div>
                        </motion.div>
                    </div>
                    
                    <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" onViewportEnter={() => setImpactInView(true)} viewport={{ once: true, amount: 0.3 }}>
                        <SpotlightCard className="lg:col-span-2 row-span-2 bg-neutral-900/80 p-10 flex flex-col justify-center relative group min-h-[300px]">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#8b5cf6 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-violet-500/20 rounded-lg text-violet-400"><Users size={24} /></div><span className="text-violet-200 font-medium">Verified Educators</span></div>
                                <div className="text-7xl md:text-8xl font-black text-white tracking-tighter mb-4 shadow-black drop-shadow-lg">{impactInView ? <CountUp end={5000} duration={3.5} separator="," start={0} /> : '0'}+</div>
                                <p className="text-neutral-400 max-w-sm text-lg">Qualified professionals from IITs, DU, and top universities ready to help you excel.</p>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-transparent opacity-50" />
                        </SpotlightCard>
                        <SpotlightCard className="lg:col-span-1 row-span-2 bg-neutral-900/60 p-8 flex flex-col justify-between border-t-4 border-t-cyan-500">
                            <div>
                                <div className="flex justify-between items-start mb-6"><div className="p-2 bg-cyan-900/20 rounded-lg text-cyan-400"><TrendingUp size={24} /></div><div className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs font-bold">+12% this week</div></div>
                                <h3 className="text-lg text-neutral-400 font-medium uppercase tracking-widest mb-2">Total Students</h3><div className="text-5xl font-bold text-white">{impactInView ? <CountUp end={12000} duration={3.5} separator="," start={0} /> : '0'}+</div>
                            </div>
                            <div className="mt-8">
                                <div className="text-sm text-neutral-500 mb-3">Recent enrollments:</div>
                                <div className="flex -space-x-3">{[1,2,3,4].map(i => (<motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-black flex items-center justify-center text-xs text-neutral-400">S{i}</motion.div>))}<div className="w-10 h-10 rounded-full bg-cyan-900/50 border-2 border-black flex items-center justify-center text-xs text-cyan-400 font-bold">+2k</div></div>
                            </div>
                        </SpotlightCard>
                        <SpotlightCard className="lg:col-span-1 bg-neutral-900/60 p-6 flex flex-col justify-between group hover:bg-neutral-800/80 transition-colors border-l-4 border-l-fuchsia-500">
                            <div className="flex justify-between items-start"><BookOpen className="text-fuchsia-500" size={28} /><Activity size={16} className="text-neutral-600" /></div><div className="mt-4"><div className="text-4xl font-bold text-white mb-1">{impactInView ? <CountUp end={50} duration={2.5} start={0} /> : '0'}+</div><div className="text-sm text-neutral-400 font-medium">Subjects Covered</div></div>
                        </SpotlightCard>
                        <SpotlightCard className="lg:col-span-1 bg-neutral-900/60 p-6 flex flex-col justify-between group hover:bg-neutral-800/80 transition-colors border-l-4 border-l-emerald-500">
                            <div className="flex justify-between items-start"><Globe className="text-emerald-500" size={28} /><MapPin size={16} className="text-neutral-600" /></div><div className="mt-4"><div className="text-4xl font-bold text-white mb-1">{impactInView ? <CountUp end={64} duration={2.5} start={0} /> : '0'}</div><div className="text-sm text-neutral-400 font-medium">Districts Active</div></div>
                        </SpotlightCard>
                    </motion.div>
                </div>
            </section>

            {/* --- 3. LATEST JOBS (UNCHANGED) --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-2">Latest Opportunities</h2>
                            <p className="text-neutral-400">Fresh tuition jobs posted by students.</p>
                        </div>
                        <Link to="/tuitions" className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors text-sm font-medium uppercase tracking-wider">
                            View All Jobs <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loadingTuitions ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-64 rounded-xl bg-neutral-900/30 border border-white/5 animate-pulse" />
                            ))
                        ) : latestTuitions.length > 0 ? (
                            latestTuitions.map((job) => (
                                <motion.div 
                                    key={job._id} 
                                    initial={{ opacity: 0, y: 20 }} 
                                    whileInView={{ opacity: 1, y: 0 }} 
                                    viewport={{ once: true }}
                                    className="group relative flex flex-col justify-between rounded-xl bg-neutral-900/60 backdrop-blur-md border border-white/10 hover:border-violet-500/40 p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.1)] overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="inline-flex items-center px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300">
                                                {job.classGrade}
                                            </span>
                                            <div className="flex items-center gap-1 text-xs text-neutral-500 font-mono">
                                                <Activity size={12} className="text-emerald-500" />
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors line-clamp-1">
                                            {job.subject}
                                        </h3>
                                        
                                        <div className="space-y-3 mb-8">
                                            <div className="flex items-center gap-3 text-sm text-neutral-400">
                                                <MapPin size={16} className="text-violet-500 shrink-0" /> 
                                                <span className="truncate">{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-neutral-400">
                                                <Clock size={16} className="text-fuchsia-500 shrink-0" />
                                                <span>{job.daysPerWeek} Days / Week</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-neutral-400">
                                                <Briefcase size={16} className="text-blue-500 shrink-0" />
                                                <span>{job.status === 'approved' ? 'Verified Post' : 'Pending'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-neutral-500 uppercase tracking-wider">Budget</span>
                                            <span className="text-lg font-bold text-white">৳ {job.budget}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleJobClick(job._id)}
                                            className="px-5 py-2.5 rounded-lg bg-white text-black text-sm font-bold hover:bg-violet-200 transition-colors shadow-lg"
                                        >
                                            Details
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-neutral-500 bg-neutral-900/20 rounded-xl border border-dashed border-neutral-800">
                                No jobs found right now.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* --- 4. HOW IT WORKS (UNCHANGED) --- */}
            <section className="py-32 px-6 border-y border-white/5 bg-black/40 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-full hidden md:block opacity-30">
                     <svg width="100%" height="200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-1/2 -translate-y-1/2">
                         <path d="M0 100 Q 250 50 500 100 T 1000 100 T 1500 100" stroke="url(#gradient-line)" strokeWidth="2" strokeDasharray="8 8" />
                         <defs><linearGradient id="gradient-line" x1="0" y1="0" x2="100%" y2="0"><stop offset="0%" stopColor="#7c3aed" stopOpacity="0" /><stop offset="50%" stopColor="#d946ef" /><stop offset="100%" stopColor="#06b6d4" stopOpacity="0" /></linearGradient></defs>
                     </svg>
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-24"><h2 className="text-5xl font-black text-white mb-6">How It Works</h2><p className="text-xl text-neutral-400">Your journey to academic success in 3 steps.</p></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {STEPS.map((step, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2, duration: 0.6 }} className={cn("relative", idx === 1 ? "md:mt-16" : idx === 2 ? "md:mt-32" : "")}>
                                <SpotlightCard className={`h-full p-8 transition-all duration-300 border-transparent hover:border-opacity-50 hover:scale-105 shadow-2xl ${step.border} ${step.shadow}`} spotlightColor={idx === 0 ? "rgba(139, 92, 246, 0.2)" : idx === 1 ? "rgba(232, 121, 249, 0.2)" : "rgba(6, 182, 212, 0.2)"}>
                                    <div className="absolute -top-6 -right-6 text-[10rem] font-black text-white/[0.03] select-none pointer-events-none leading-none">{idx + 1}</div>
                                    <div className="relative z-10 flex flex-col items-center text-center h-full">
                                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:rotate-12 ${step.bg} ${step.color} shadow-inner`}><step.icon size={32} strokeWidth={2} /></div>
                                        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-400 transition-all">{step.title}</h3>
                                        <p className="text-neutral-400 leading-relaxed">{step.desc}</p>
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 5. FEATURED TUTORS (UNCHANGED) --- */}
            <section className="py-24 overflow-hidden border-b border-white/5 bg-black/60">
                <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
                    <div><h2 className="text-4xl font-bold text-white mb-2">Featured Tutors</h2><p className="text-neutral-400">Learn from the best educators.</p></div>
                    <Link to="/tutors" className="hidden md:flex text-fuchsia-400 hover:text-fuchsia-300 uppercase text-sm font-bold tracking-widest gap-2 items-center">View All <ArrowRight size={16} /></Link>
                </div>
                
                <div className="relative w-full py-12">
                    <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />
                    
                    {loadingTutors ? (<div className="flex justify-center p-12"><Loader2 className="animate-spin text-violet-500" size={32} /></div>) : featuredTutors.length > 0 ? (
                        <div className="flex overflow-hidden">
                            <motion.div 
                                className="flex gap-8 px-4" 
                                animate={{ x: "-50%" }} 
                                transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                            >
                                {[...featuredTutors, ...featuredTutors].map((tutor, idx) => (
                                    <div 
                                        key={`${tutor._id}-${idx}`} 
                                        className="w-[350px] flex-shrink-0 relative z-0 hover:z-10 transition-all duration-300"
                                    >
                                        <TutorCard tutor={tutor} />
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    ) : (<div className="text-center text-neutral-500 py-10">No featured tutors yet.</div>)}
                </div>
            </section>

            {/* --- 6. WHY CHOOSE US (UNCHANGED) --- */}
            <section className="py-32 px-6 relative z-10 border-t border-white/5 bg-gradient-to-b from-black/0 to-neutral-900/20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
                    <div className="lg:col-span-7 space-y-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Why top students <br />choose <span className="text-violet-400">eTuitionBd</span>.</h2>
                            <p className="text-neutral-400 text-lg max-w-lg leading-relaxed">We don't just connect you; we secure the entire process. Experience the most trusted education platform in Bangladesh.</p>
                        </motion.div>
                        <div className="space-y-4">
                            {[
                                { title: "Verified Tutors", desc: "Every tutor undergoes a strict NID & academic background verification.", icon: ShieldCheck, color: "text-emerald-400", glow: "group-hover:shadow-emerald-900/20", border: "group-hover:border-emerald-500/30", bg: "group-hover:bg-emerald-500/5" },
                                { title: "Fast Matching", desc: "Our AI algorithm connects you with the perfect tutor within 24 hours.", icon: Zap, color: "text-amber-400", glow: "group-hover:shadow-amber-900/20", border: "group-hover:border-amber-500/30", bg: "group-hover:bg-amber-500/5" },
                                { title: "Secure Payment", desc: "Hassle-free, transparent processing with full escrow protection.", icon: DollarSign, color: "text-cyan-400", glow: "group-hover:shadow-cyan-900/20", border: "group-hover:border-cyan-500/30", bg: "group-hover:bg-cyan-500/5" }
                            ].map((feat, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                    <SpotlightCard className={`flex items-start gap-6 p-6 transition-all duration-300 ${feat.bg} ${feat.border} group cursor-default`}>
                                        <div className={`mt-1 w-12 h-12 rounded-xl bg-neutral-900/80 border border-white/5 flex items-center justify-center ${feat.color} shadow-lg transition-all duration-300 group-hover:scale-110 ${feat.glow}`}><feat.icon size={24} strokeWidth={2} /></div>
                                        <div><h3 className={`text-xl font-bold text-white mb-2 transition-colors duration-300 ${feat.color.replace('text-', 'group-hover:text-')}`}>{feat.title}</h3><p className="text-neutral-400 text-sm leading-relaxed group-hover:text-neutral-300 transition-colors">{feat.desc}</p></div>
                                        <div className="ml-auto opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-neutral-500"><ArrowRight size={20} /></div>
                                    </SpotlightCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-5 h-full pt-8 lg:pt-0">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="sticky top-32">
                            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 via-black to-neutral-950 border border-white/10 shadow-2xl">
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px]" /><div className="absolute -bottom-20 -left-20 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px]" /><div className="absolute top-6 right-8 text-neutral-800/50"><Quote size={120} strokeWidth={0} fill="currentColor" /></div>
                                <div className="relative p-10 flex flex-col h-[500px]">
                                    <div className="flex gap-1 mb-8">{[...Array(5)].map((_, i) => (<motion.div key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + (i * 0.1) }}><Star size={18} className="fill-yellow-400 text-yellow-400" /></motion.div>))}</div>
                                    <blockquote className="text-2xl md:text-3xl font-medium text-white leading-normal italic mb-auto">"Found an excellent tutor within <span className="text-violet-400 not-italic font-bold">48 hours</span>. The verification process gave me confidence. Highly recommend!"</blockquote>
                                    <div className="mt-10 pt-8 border-t border-white/10 flex items-center gap-4">
                                        <div className="relative"><div className="absolute inset-0 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-full blur-sm opacity-50" /><div className="relative w-14 h-14 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-white text-lg font-bold z-10">M</div><div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black flex items-center justify-center z-20"><CheckCircle size={10} className="text-black stroke-[3px]" /></div></div>
                                        <div>
                                            <div className="text-white font-bold text-lg">Meera Reddy</div>
                                            <div className="text-neutral-400 text-sm">Guardian, Hyderabad</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- 7. CTA (UNCHANGED) --- */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-900/10" />
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">Start your journey.</h2>
                    <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto">Whether you are looking to learn or looking to earn, we have built the perfect ecosystem for you.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link to="/register"><button className="px-10 py-5 bg-white text-black text-lg font-bold rounded-full hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-shadow duration-300 w-full sm:w-auto">Create Free Account</button></Link>
                        <Link to="/tuitions"><button className="px-10 py-5 bg-transparent border border-neutral-700 text-white text-lg font-bold rounded-full hover:bg-neutral-800 transition-colors w-full sm:w-auto">Browse Jobs</button></Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;