import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
    Search, BookOpen, Users, CheckCircle, ArrowRight, ShieldCheck, Zap,
    DollarSign, MapPin, Clock, Loader2, Star
} from "lucide-react";

/* ADVANCED STYLES */
const styles = `
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(1.3); opacity: 0; }
  }
  @keyframes particle-float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translate(var(--tx), var(--ty)) rotate(360deg); opacity: 0; }
  }
  @keyframes shimmer-slide {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2), inset 0 0 20px rgba(139, 92, 246, 0.1); }
    50% { box-shadow: 0 0 30px rgba(236, 72, 153, 0.6), 0 0 60px rgba(236, 72, 153, 0.3), inset 0 0 30px rgba(236, 72, 153, 0.15); }
  }
  @keyframes border-rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-marquee {
    animation: scroll 40s linear infinite;
  }
  .marquee-container:hover .animate-marquee {
    animation-play-state: paused !important;
  }
  .float {
    animation: float 3s ease-in-out infinite;
  }
  .stat-card {
    position: relative;
    overflow: hidden;
  }
  .stat-card::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, #8b5cf6, #ec4899, #8b5cf6);
    opacity: 0;
    transition: opacity 0.3s;
    z-index: -1;
    border-radius: inherit;
    filter: blur(20px);
  }
  .stat-card:hover::before {
    opacity: 0.6;
  }
  .stat-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%);
    opacity: 0;
    transition: all 0.5s;
  }
  .stat-card:hover::after {
    opacity: 1;
    animation: shimmer-slide 1.5s infinite;
  }
  .pulse-ring {
    position: absolute;
    inset: 0;
    border: 2px solid rgba(139, 92, 246, 0.5);
    border-radius: inherit;
    animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .step-card {
    position: relative;
    overflow: hidden;
  }
  .step-card::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent 70%);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  .step-card:hover::before {
    width: 300%;
    height: 300%;
  }
  .border-gradient {
    position: relative;
  }
  .border-gradient::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, #8b5cf6, #ec4899, #06b6d4, #8b5cf6);
    border-radius: inherit;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s;
    background-size: 300% 300%;
    animation: border-rotate 3s linear infinite;
  }
  .border-gradient:hover::after {
    opacity: 1;
  }
`;

/* DATA */
const STATIC_STATS_DATA = [
  { label: "Active Tutors", val: 5000, suffix: "+" },
  { label: "Happy Students", val: 12000, suffix: "+" },
  { label: "Subjects", val: 50, suffix: "+" },
  { label: "Districts", val: 64, suffix: "" },
];

const STEPS = [
  { icon: Users, title: "Create Account", desc: "Sign up as a Student or Tutor to get started with your personalized dashboard." },
  { icon: BookOpen, title: "Post or Apply", desc: "Students post requirements. Tutors apply to jobs that match their skills." },
  { icon: CheckCircle, title: "Match & Learn", desc: "Connect, confirm the tuition, and start your learning journey seamlessly." }
];

const FEATURES = [
  { icon: ShieldCheck, title: "Verified Tutors", desc: "Every tutor undergoes a strict verification process." },
  { icon: Zap, title: "Fast Matching", desc: "Get connected with the right tutor within 24 hours." },
  { icon: DollarSign, title: "Secure Payment", desc: "Hassle-free and transparent payment processing." },
];

const MOCK_TUITIONS = [
  { id: 1, subject: "Mathematics", classGrade: "Class 10 - SSC", location: "Dhanmondi, Dhaka", daysPerWeek: "4 days/week", budget: "8000", createdAt: new Date() },
  { id: 2, subject: "Physics", classGrade: "Class 12 - HSC", location: "Gulshan, Dhaka", daysPerWeek: "3 days/week", budget: "10000", createdAt: new Date() },
  { id: 3, subject: "English", classGrade: "Class 8", location: "Uttara, Dhaka", daysPerWeek: "5 days/week", budget: "6000", createdAt: new Date() },
];

const MOCK_TUTORS = [
  { id: 1, name: "Dr. Ashraf Khan", subject: "Mathematics", rating: 4.9, students: 150, img: "https://i.pravatar.cc/150?img=12" },
  { id: 2, name: "Fatima Rahman", subject: "Physics", rating: 4.8, students: 120, img: "https://i.pravatar.cc/150?img=45" },
  { id: 3, name: "Kamal Hossain", subject: "Chemistry", rating: 4.9, students: 180, img: "https://i.pravatar.cc/150?img=33" },
  { id: 4, name: "Nadia Islam", subject: "English", rating: 5.0, students: 200, img: "https://i.pravatar.cc/150?img=47" },
];

/* ANIMATION VARIANTS */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

/* STAT ITEM WITH PARTICLES */
const StatItem = ({ label, val, suffix }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000;
      const increment = val / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= val) {
          setCount(val);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, val]);

  return (
    <motion.div 
      ref={ref}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, y: -5 }}
      className="stat-card relative bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-neutral-800 rounded-2xl p-6 md:p-8 text-center cursor-pointer group overflow-hidden h-full min-h-[180px] md:min-h-[200px] flex flex-col items-center justify-center"
    >
      {/* Animated rings */}
      {isHovered && (
        <>
          <div className="pulse-ring" style={{ animationDelay: '0s' }} />
          <div className="pulse-ring" style={{ animationDelay: '0.5s' }} />
          <div className="pulse-ring" style={{ animationDelay: '1s' }} />
        </>
      )}
      
      {/* Particle effects */}
      {isHovered && [...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            x: [0, (Math.cos(i * 45 * Math.PI / 180) * 60)],
            y: [0, (Math.sin(i * 45 * Math.PI / 180) * 60)],
            scale: [0, 1, 0]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            delay: i * 0.1 
          }}
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-violet-500 rounded-full pointer-events-none"
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      ))}

      <motion.div
        animate={isHovered ? { 
          textShadow: [
            '0 0 20px rgba(139, 92, 246, 0.5)',
            '0 0 40px rgba(236, 72, 153, 0.8)',
            '0 0 20px rgba(139, 92, 246, 0.5)'
          ]
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-black text-white mb-2 md:mb-3 tracking-tight"
      >
        {inView ? count.toLocaleString() : 0}{suffix}
      </motion.div>
      <div className="relative z-10 text-xs sm:text-sm text-neutral-400 uppercase tracking-widest font-bold group-hover:text-violet-400 transition-colors px-2">
        {label}
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-12 md:w-16 h-12 md:h-16 border-t-2 border-l-2 border-violet-500/50 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-12 md:w-16 h-12 md:h-16 border-b-2 border-r-2 border-fuchsia-500/50 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

/* TUTOR CARD */
const TutorCard = ({ tutor }) => (
  <motion.div 
    whileHover={{ y: -6 }}
    transition={{ duration: 0.2 }}
    className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 transition-all"
  >
    <div className="flex items-center gap-4 mb-4">
      <img src={tutor.img} alt={tutor.name} className="w-14 h-14 rounded-lg object-cover" />
      <div>
        <div className="font-semibold text-white">{tutor.name}</div>
        <div className="text-sm text-neutral-400">{tutor.subject}</div>
      </div>
    </div>
    <div className="flex items-center justify-between text-sm mb-4">
      <div className="flex items-center gap-1 text-amber-500">
        <Star size={14} fill="currentColor" />
        <span className="font-medium">{tutor.rating}</span>
      </div>
      <div className="text-neutral-400">{tutor.students} students</div>
    </div>
    <button className="w-full py-2.5 rounded-lg bg-neutral-800 text-white text-sm font-medium hover:bg-violet-600 transition-colors">
      View Profile
    </button>
  </motion.div>
);

/* MAIN COMPONENT */
const Home = () => {
  const [latestTuitions] = useState(MOCK_TUITIONS);
  const [featuredTutors] = useState(MOCK_TUTORS);

  return (
    <div className="min-h-screen bg-black text-neutral-100 overflow-x-hidden">
      <style>{styles}</style>

      {/* Ambient background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-1/2 left-1/4 w-96 h-96 bg-violet-600 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-fuchsia-600 rounded-full blur-[150px]" />
      </div>

      {/* HERO */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 text-sm text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-violet-500" />
              Trusted by 12,000+ students across Bangladesh
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight">
              Find Your Perfect
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Tutor Match
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Connect with verified tutors and students instantly. Professional, reliable, results-driven education platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-semibold text-lg hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2"
              >
                Find a Tutor
                <Search size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all flex items-center justify-center gap-2"
              >
                Become a Tutor
                <ArrowRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <div className="border-y border-neutral-800 bg-gradient-to-b from-black via-neutral-950 to-black py-16 md:py-24 relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-2">Our Records</h2>
            <p className="text-neutral-400 text-lg">Trusted by thousands across Bangladesh</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
          >
            {STATIC_STATS_DATA.map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="w-full">
                <StatItem {...stat} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-48 h-48 md:w-64 md:h-64 bg-violet-600/20 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-48 h-48 md:w-64 md:h-64 bg-fuchsia-600/20 rounded-full blur-[100px] -translate-y-1/2" />
      </div>

      {/* TUITION JOBS */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Latest Tuition Jobs</h2>
              <p className="text-neutral-400 text-lg">Fresh opportunities posted by students</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-neutral-400 hover:text-white transition-colors font-medium">
              View all
              <ArrowRight size={18} />
            </button>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {latestTuitions.map((job) => (
              <motion.div 
                key={job.id}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 text-xs font-semibold border border-violet-500/20">
                    {job.subject}
                  </span>
                  <span className="text-neutral-500 text-xs">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">{job.classGrade}</h3>
                
                <div className="space-y-2.5 text-sm text-neutral-400 mb-5">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-neutral-600" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-neutral-600" />
                    {job.daysPerWeek}
                  </div>
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <DollarSign size={16} className="text-emerald-500" />
                    {job.budget} BDT/mo
                  </div>
                </div>
                
                <button className="w-full py-3 rounded-lg bg-neutral-800 text-white font-medium hover:bg-violet-600 transition-colors">
                  View Details
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 border-y border-neutral-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-white mb-4">How It Works</h2>
            <p className="text-neutral-400 text-xl">Get started in three simple steps</p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {STEPS.map((step, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                whileHover={{ 
                  y: -12,
                  rotateY: 5,
                  rotateX: 5,
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="step-card border-gradient relative bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-neutral-800 rounded-2xl p-8 text-center group cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Floating icon container */}
                <motion.div
                  whileHover={{ 
                    scale: 1.15,
                    rotate: [0, -10, 10, -10, 0],
                  }}
                  transition={{ 
                    rotate: { duration: 0.5 },
                    scale: { duration: 0.3 }
                  }}
                  className="relative w-20 h-20 mx-auto mb-6"
                >
                  {/* Icon glow background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Icon container */}
                  <div className="relative w-full h-full bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:shadow-violet-500/50">
                    <step.icon size={32} strokeWidth={2.5} />
                  </div>

                  {/* Orbiting particles */}
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {[0, 120, 240].map((angle, i) => (
                      <div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-violet-400 rounded-full"
                        style={{
                          transform: `rotate(${angle}deg) translateX(45px) translateY(-50%)`
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 group-hover:bg-clip-text transition-all">
                  {step.title}
                </h3>
                <p className="text-neutral-400 leading-relaxed group-hover:text-neutral-300 transition-colors">
                  {step.desc}
                </p>

                {/* Step number badge */}
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-2xl shadow-violet-500/50"
                >
                  {idx + 1}
                </motion.div>

                {/* Corner decorations */}
                <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-violet-500/0 group-hover:border-violet-500/50 rounded-tl-xl transition-all duration-300" />
                <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-fuchsia-500/0 group-hover:border-fuchsia-500/50 rounded-br-xl transition-all duration-300" />

                {/* Connecting line to next card (except last one) */}
                {idx !== STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-30 group-hover:opacity-100 transition-opacity" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURED TUTORS */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex justify-between items-end"
          >
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Featured Tutors</h2>
              <p className="text-neutral-400 text-lg">Learn from top-rated educators</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-neutral-400 hover:text-white transition-colors font-medium">
              View all
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>

        <div className="relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />
          
          <div className="marquee-container flex w-max animate-marquee gap-6 py-4 px-4">
            {[...featuredTutors, ...featuredTutors].map((tutor, index) => (
              <div key={`${tutor.id}-${index}`} className="w-80 flex-shrink-0">
                <TutorCard tutor={tutor} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 px-6 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Why Choose<br />eTuitionBd
              </h2>
              <p className="text-neutral-400 text-lg mb-10 leading-relaxed">
                The most trusted platform connecting students with qualified educators across Bangladesh.
              </p>
              
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-6"
              >
                {FEATURES.map((feat, idx) => (
                  <motion.div 
                    key={idx}
                    variants={fadeInUp}
                    whileHover={{ x: 8 }}
                    className="flex gap-5 p-5 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-violet-500/50 transition-all"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white">
                      <feat.icon size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg mb-1">{feat.title}</div>
                      <div className="text-neutral-400">{feat.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative h-[500px] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20" />
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671')] bg-cover bg-center opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-8 left-8 right-8 bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-xl p-6"
              >
                <p className="text-white italic text-lg mb-4 leading-relaxed">
                  "Found an excellent tutor within 48 hours. The verification process gave me confidence. Highly recommend!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
                    F
                  </div>
                  <div>
                    <div className="font-bold text-white">Mrs. Farhana</div>
                    <div className="text-sm text-neutral-400">Guardian, Dhaka</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto text-center bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 border border-violet-500/20 backdrop-blur-sm rounded-2xl p-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-neutral-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students and tutors on Bangladesh's most reliable education platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-neutral-100 transition-colors"
            >
              Sign Up Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-lg rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition-all"
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;