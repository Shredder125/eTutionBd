import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { 
    Search, BookOpen, Users, CheckCircle, ArrowRight, ShieldCheck, Zap,
    DollarSign, MapPin, Clock, Loader2 
} from "lucide-react";
import TutorCard from "../components/TutorCard"; 

/* FIXED MARQUEE CSS */
const marqueeStyle = `
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    animation: scroll 40s linear infinite;
  }
  .marquee-container:hover .animate-marquee {
    animation-play-state: paused !important;
  }
`;

/* --- LIVE STATS DATA (Used for CountUp placeholders) --- */
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

/* --- ANIMATION VARIANTS --- */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

/* --- SUB-COMPONENT: STAT ITEM --- */
const StatItem = ({ label, val, suffix }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div ref={ref} className="group cursor-default">
      <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight group-hover:scale-110 transition-transform duration-300">
        {inView ? (
          <CountUp 
            start={0} 
            end={val} 
            duration={2.5} 
            separator="," 
            suffix={suffix} 
          />
        ) : (
          0
        )}
      </h3>
      <p className="text-sm md:text-base font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 drop-shadow-sm">
        {label}
      </p>
    </div>
  );
};

/* --- MAIN PAGE COMPONENT --- */
const Home = () => {
  const [latestTuitions, setLatestTuitions] = useState([]);
  const [featuredTutors, setFeaturedTutors] = useState([]);
  const [tuitionLoading, setTuitionLoading] = useState(true);
  const [tutorLoading, setTutorLoading] = useState(true);

  /* ✅ FIXED: Fetch function MOVED OUTSIDE useEffect & made self-contained */
  const fetchData = async (url, setter, setLoading) => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url, { 
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`${url} failed: ${response.status}`);
        setter([]);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        console.warn(`${url} returned HTML (Vite dev server)`);
        setter([]);
        return;
      }

      const data = await response.json();
      setter(data.result || data || []);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(`Fetch error for ${url}:`, error);
      }
      setter([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch tuitions
    fetchData("/api/tuitions?limit=3", setLatestTuitions, setTuitionLoading);
    
    // Fetch tutors  
    fetchData("/api/featured-tutors", setFeaturedTutors, setTutorLoading);

    // Cleanup on unmount
    return () => {};
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 overflow-x-hidden font-sans selection:bg-purple-500/30">
      <style>{marqueeStyle}</style>

      {/* 1. HERO SECTION - UNCHANGED */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px]" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/50 border border-neutral-800 text-sm text-purple-400 mb-4 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              #1 Trusted Tuition Platform in Bangladesh
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Find the Perfect <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                Tutor or Student
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Connect with verified tutors and eager students instantly. The smartest way to learn, teach, and grow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link to="/tutors" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-neutral-950 font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                Find a Tutor <Search size={20} />
              </Link>
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                Become a Tutor <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS BANNER - UNCHANGED */}
      <div className="border-y border-neutral-900 bg-neutral-950/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-purple-900/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          {STATIC_STATS_DATA.map((stat, idx) => (
            <StatItem key={idx} label={stat.label} val={stat.val} suffix={stat.suffix} />
          ))}
        </div>
      </div>

      {/* 3. LATEST TUITION POSTS - FIXED */}
      <section className="py-24 px-6 bg-neutral-950 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Latest Tuition Jobs</h2>
              <p className="text-neutral-400">Fresh opportunities posted by students.</p>
            </div>
            <Link to="/tuitions" className="hidden md:flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {tuitionLoading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-purple-600 h-8 w-8" /></div>
          ) : latestTuitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestTuitions.map((job, idx) => (
                <motion.div 
                  key={job._id || job.id || idx}
                  whileHover={{ y: -5 }}
                  className="group p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium">
                      {job.subject || 'General'}
                    </span>
                    <span className="text-neutral-500 text-xs">
                      {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{job.classGrade || 'Various Classes'}</h3>
                  <div className="space-y-3 text-neutral-400 text-sm mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-neutral-600" /> {job.location || 'Bangladesh'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-neutral-600" /> {job.daysPerWeek || 'Flexible'}
                    </div>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <DollarSign size={16} className="text-green-500" /> {job.budget || 'Negotiable'} BDT/mo
                    </div>
                  </div>
                  <Link to="/tuitions" className="block w-full py-3 text-center rounded-lg bg-neutral-800 text-white group-hover:bg-purple-600 transition-colors">
                    View Details
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid place-items-center py-20 text-neutral-500">
              <p className="text-center text-lg">No approved tuitions available yet. Post one via the Dashboard!</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. HOW IT WORKS - UNCHANGED */}
      <section className="py-24 px-6 bg-neutral-900/20 border-y border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-neutral-400">Get started in 3 simple steps.</p>
          </div>
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
                className="relative p-8 rounded-2xl bg-neutral-950 border border-neutral-800 text-center hover:bg-neutral-900 transition-colors"
              >
                <div className="w-16 h-16 mx-auto bg-neutral-900 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                  <step.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{step.desc}</p>
                {idx !== STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-neutral-800" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. TOP TUTORS MARQUEE - FIXED */}
      <section className="py-24 bg-neutral-950 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Tutors</h2>
              <p className="text-neutral-400">Learn from the best minds in the country.</p>
            </div>
            <Link to="/tutors" className="hidden md:flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
              Find More Tutors <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-r from-neutral-950 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none" />
          
          {tutorLoading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-purple-600 h-8 w-8" /></div>
          ) : featuredTutors.length > 0 ? (
            <div className="marquee-container flex w-max animate-marquee gap-8 py-4 px-4">
              {[...featuredTutors, ...featuredTutors].map((tutor, index) => (
                <div key={`${tutor.email || tutor.id || tutor.name || index}-${index}`} className="w-[22rem] flex-shrink-0">
                  <TutorCard tutor={tutor} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center p-10">
              <p className="text-neutral-500 text-lg">No featured tutors available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* 6-7. WHY CHOOSE US & CTA - UNCHANGED */}
      <section className="py-24 px-6 bg-gradient-to-b from-neutral-900 to-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Why eTuitionBd is the <br />
                <span className="text-purple-500">Smartest Choice?</span>
              </h2>
              <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
                We bridge the gap between passion and education. Our platform ensures safety, reliability, and speed so you can focus on what matters—learning.
              </p>
              <div className="space-y-6">
                {FEATURES.map((feat, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <feat.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">{feat.title}</h4>
                      <p className="text-neutral-500 text-sm">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[500px] rounded-3xl bg-neutral-800 overflow-hidden border border-neutral-700/50">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop')] bg-cover bg-center opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-neutral-900/80 backdrop-blur-md border border-neutral-700 shadow-2xl">
                <p className="text-white italic">"This platform helped me find a tutor for my son within 2 days. Highly recommended!"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500" />
                  <div>
                    <p className="text-sm font-bold text-white">Mrs. Farhana</p>
                    <p className="text-xs text-neutral-400">Guardian</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/20 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h2 className="relative z-10 text-3xl md:text-5xl font-bold text-white mb-6">Ready to Start Learning?</h2>
          <p className="relative z-10 text-neutral-300 mb-8 text-lg max-w-2xl mx-auto">
            Join thousands of students and tutors on the most reliable education platform in Bangladesh.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="px-8 py-4 bg-white text-purple-900 font-bold rounded-xl hover:bg-neutral-100 transition-colors">
              Get Started Now
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-transparent border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
