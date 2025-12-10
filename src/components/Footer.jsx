import React, { useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone, 
  ChevronRight,
  Send,
  Sparkles,
  ArrowUp,
  ShieldCheck
} from "lucide-react";

/* CUSTOM X ICON */
const XIcon = ({ size = 24, className, ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/* STYLES & UTILS                                                             */
/* -------------------------------------------------------------------------- */
const styles = `
  .glass-card {
    background: rgba(10, 10, 10, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  /* Synced with Home Page Animation */
  @keyframes gradient-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .footer-animated-bg {
    background: linear-gradient(-45deg, #000000, #1e1b4b, #0f172a, #020617);
    background-size: 400% 400%;
    animation: gradient-flow 15s ease infinite; 
  }
`;

const SOCIAL_LINKS = [
  { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-500", border: "hover:border-blue-500/50" },
  { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-500", border: "hover:border-pink-500/50" },
  { icon: XIcon, href: "#", label: "X (Twitter)", color: "hover:text-white", border: "hover:border-white/50" },
  { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-400", border: "hover:border-blue-400/50" },
];

const FOOTER_SECTIONS = [
  {
    title: "Platform",
    links: [
      { label: "Find Tutors", href: "/tutors" },
      { label: "Browse Jobs", href: "/jobs" },
      { label: "Online Classes", href: "/classes" },
      { label: "Institute Partner", href: "/partnership" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Safety Guidelines", href: "/safety" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const CONTACT_INFO = [
  { icon: Phone, text: "+91 98765-43210", href: "tel:+919876543210" },
  { icon: Mail, text: "support@etuitionbd.com", href: "mailto:support@etuitionbd.com" },
  { icon: MapPin, text: "Indiranagar, Bangalore, India", href: null },
];

/* -------------------------------------------------------------------------- */
/* ANIMATED COMPONENTS                                                        */
/* -------------------------------------------------------------------------- */

// Magnetic Social Button
const MagneticButton = ({ icon: Icon, href, label, color, border }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((event.clientX - centerX) * 0.3);
    y.set((event.clientY - centerY) * 0.3);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      href={href}
      aria-label={label}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`relative p-3 rounded-xl bg-white/5 border border-white/10 text-neutral-400 transition-all duration-300 group ${color} ${border}`}
    >
      <Icon size={20} className="relative z-10 transition-transform group-hover:scale-110" />
      <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.a>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN FOOTER                                                                */
/* -------------------------------------------------------------------------- */

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{styles}</style>
      <footer className="relative bg-[#000000] text-neutral-200 pt-24 pb-12 overflow-hidden border-t border-white/5">
        
        {/* === DARK FOREVER GRADIENT BACKGROUND (MATCHED) === */}
        <div className="absolute inset-0 z-0 footer-animated-bg">
            {/* Grain Texture (Low Opacity) */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
            
            {/* Vignette to darken edges even more */}
            <div className="absolute inset-0 bg-radial-[circle_at_center_transparent_0%_#000000_100%] opacity-60"></div>
        </div>

        {/* Grid Overlay (Subtle) */}
        <div className="absolute inset-0 pointer-events-none z-0">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        {/* Glow Orbs (Matched Colors: Indigo/Slate) */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none z-0" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-900/10 rounded-full blur-[150px] pointer-events-none z-0" />

        <div className="relative max-w-7xl mx-auto px-6 z-10">
          
          {/* TOP SECTION: BRAND & NEWSLETTER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 border-b border-white/5 pb-12">
            
            {/* Brand Area */}
            <div className="lg:col-span-5 space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }}
                className="inline-block"
              >
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-white tracking-tight">eTuitionBd</span>
                </div>
                <p className="text-neutral-500 leading-relaxed max-w-sm">
                  India's most advanced AI-powered tutoring platform. Connecting brilliant minds from IITs and Top Universities with ambitious learners.
                </p>
              </motion.div>

              <div className="flex gap-4">
                {SOCIAL_LINKS.map((social, idx) => (
                  <MagneticButton key={idx} {...social} />
                ))}
              </div>
            </div>

            {/* Newsletter Area (Updated Colors) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }} 
                 whileInView={{ opacity: 1, y: 0 }} 
                 viewport={{ once: true }}
                 className="glass-card p-8 rounded-2xl relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-900/20 rounded-full blur-[80px]" />
                  <div className="relative z-10">
                      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <Sparkles size={18} className="text-indigo-400" /> 
                        Join the Elite Circle
                      </h3>
                      <p className="text-neutral-500 text-sm mb-6">Get weekly study hacks and exam tips from top educators.</p>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-grow group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-800 to-purple-800 rounded-xl opacity-30 group-hover:opacity-100 transition duration-500 blur-sm group-focus-within:opacity-100"></div>
                            <input 
                                type="email" 
                                placeholder="name@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="relative w-full bg-black/50 text-white px-4 py-3.5 rounded-xl border border-white/10 focus:outline-none focus:ring-0 placeholder-neutral-600"
                            />
                        </div>
                        <button className="px-6 py-3.5 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                            Subscribe <Send size={16} />
                        </button>
                      </div>
                  </div>
               </motion.div>
            </div>
          </div>

          {/* MIDDLE SECTION: LINKS & INFO */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 mb-12">
            
            {FOOTER_SECTIONS.map((section, idx) => (
              <div key={idx} className="col-span-1">
                <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-4 bg-indigo-500 rounded-full" />
                    {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a href={link.href} className="text-sm text-neutral-500 hover:text-white transition-colors flex items-center gap-1 group">
                        <ChevronRight size={12} className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Column (Updated Colors) */}
            <div className="col-span-2 md:col-span-2 lg:col-span-1">
                <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-4 bg-purple-500 rounded-full" />
                    Contact
                </h4>
                <ul className="space-y-4">
                    {CONTACT_INFO.map((info, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-neutral-500">
                            <div className="p-2 bg-white/5 rounded-lg text-purple-400">
                                <info.icon size={16} />
                            </div>
                            <div>
                                <span className="block text-xs text-neutral-600 uppercase tracking-wider mb-0.5">
                                    {idx === 0 ? "Call Us" : idx === 1 ? "Email" : "Headquarters"}
                                </span>
                                {info.href ? (
                                    <a href={info.href} className="text-neutral-500 hover:text-white transition-colors">{info.text}</a>
                                ) : (
                                    <span className="text-neutral-500">{info.text}</span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Status Column */}
            <div className="col-span-2 md:col-span-2 lg:col-span-1">
                 <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                    <h5 className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-4">System Status</h5>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-900 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                        </div>
                        <span className="text-green-500 font-mono text-sm">All Systems Go</span>
                    </div>
                    <div className="text-xs text-neutral-600 mb-4">Last checked: Just now</div>
                    
                    <div className="flex gap-2">
                        <ShieldCheck size={16} className="text-neutral-600" />
                        <span className="text-xs text-neutral-600">SSL Encrypted</span>
                    </div>
                 </div>
            </div>

          </div>

          {/* BOTTOM BAR */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-600 border-t border-white/5">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <span>© {currentYear} eTuitionBd Inc.</span>
                <span className="hidden md:block w-1 h-1 bg-neutral-800 rounded-full" />
                <div className="flex gap-4">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Sitemap</a>
                </div>
            </div>
            
            <button 
                onClick={handleScrollTop} 
                className="group flex items-center gap-2 text-neutral-500 hover:text-white transition-colors px-4 py-2 rounded-full bg-white/5 hover:bg-white/10"
            >
                Back to top <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;