import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone, 
  ChevronRight,
  Send,
  Sparkles
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

/* ADVANCED STYLES */
const styles = `
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes shimmer {
    0% { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }
  .shimmer-text {
    background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 50%, #8b5cf6 100%);
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }
`;

/* DATA */
const SOCIAL_LINKS = [
  { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
  { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
  { icon: XIcon, href: "#", label: "X (Twitter)", color: "hover:bg-neutral-700" },
  { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" },
];

const FOOTER_SECTIONS = [
  {
    title: "Services",
    links: [
      { label: "Tuition Jobs", href: "/jobs" },
      { label: "Find Tutors", href: "/tutors" },
      { label: "Online Classes", href: "/classes" },
      { label: "Institute Partnership", href: "/partnership" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Use", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund Policy", href: "/refund" },
      { label: "Community Guidelines", href: "/guidelines" },
    ],
  },
];

const CONTACT_INFO = [
  { icon: Phone, text: "+880 1234-567890", href: "tel:+8801234567890" },
  { icon: Mail, text: "support@etuitionbd.com", href: "mailto:support@etuitionbd.com" },
  { icon: MapPin, text: "Dhaka, Bangladesh", href: null },
];

/* ANIMATION VARIANTS */
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

/* SOCIAL BUTTON */
const SocialButton = ({ icon: Icon, href, label, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      aria-label={label}
      whileHover={{ scale: 1.1, y: -3 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-violet-500/50 transition-all duration-300 overflow-hidden group ${color}`}
    >
      {isHovered && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl"
        />
      )}
      <Icon size={20} className="relative z-10" />
    </motion.a>
  );
};

/* FOOTER COLUMN */
const FooterColumn = ({ title, links }) => (
  <motion.div variants={fadeInUp}>
    <h3 className="text-lg font-bold mb-6 text-white">{title}</h3>
    <ul className="space-y-3">
      {links.map((link, i) => (
        <motion.li 
          key={i}
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <a
            href={link.href}
            className="group flex items-center gap-2 text-neutral-400 hover:text-violet-400 transition-colors duration-200"
          >
            <ChevronRight
              size={16}
              className="text-neutral-700 group-hover:text-violet-500 transition-colors"
            />
            {link.label}
          </a>
        </motion.li>
      ))}
    </ul>
  </motion.div>
);

/* MAIN FOOTER */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      console.log("Subscribed:", email);
      setEmail("");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <footer className="relative bg-black text-neutral-200 pt-20 md:pt-24 pb-8 px-4 sm:px-6 overflow-hidden border-t border-neutral-900">
        
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute -top-1/2 left-1/4 w-96 h-96 bg-violet-600 rounded-full blur-[150px]" />
          <div className="absolute -bottom-1/2 right-1/4 w-96 h-96 bg-fuchsia-600 rounded-full blur-[150px]" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto z-10">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16"
          >
            
            {/* BRAND COLUMN */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="space-y-3">
                <motion.h2 
                  whileHover={{ scale: 1.05 }}
                  className="text-4xl font-black shimmer-text cursor-pointer inline-block"
                >
                  eTuitionBd
                </motion.h2>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Empowering education with reliable tuition services. Learn, teach, and grow with Bangladesh's most trusted platform.
                </p>
              </div>
              
              {/* Social Links with animations */}
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((social, idx) => (
                  <SocialButton key={idx} {...social} />
                ))}
              </div>

              {/* Trust badge */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 border border-violet-500/20"
              >
                <Sparkles size={16} className="text-violet-400" />
                <span className="text-sm text-neutral-300 font-medium">Trusted by 12,000+ students</span>
              </motion.div>
            </motion.div>

            {/* DYNAMIC LINK COLUMNS */}
            {FOOTER_SECTIONS.map((section, idx) => (
              <FooterColumn key={idx} title={section.title} links={section.links} />
            ))}

            {/* NEWSLETTER & CONTACT */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-4 text-white">Stay Updated</h3>
                <p className="text-neutral-400 text-sm mb-4">
                  Subscribe for the latest tutor jobs and exclusive updates.
                </p>
                
                <div className="relative group">
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="flex rounded-xl bg-neutral-900/70 border-2 border-neutral-800 focus-within:border-violet-500/50 transition-all overflow-hidden"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubscribe()}
                      placeholder="Enter your email"
                      className="w-full bg-transparent py-3 px-4 text-sm text-white placeholder-neutral-500 outline-none"
                    />
                    <motion.button 
                      onClick={handleSubscribe}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-5 transition-all"
                    >
                      <Send size={18} />
                    </motion.button>
                  </motion.div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-3 pt-2">
                {CONTACT_INFO.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 text-neutral-400 text-sm group"
                  >
                    <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-violet-400 group-hover:bg-violet-500/10 group-hover:border-violet-500/30 transition-all">
                      <item.icon size={14} />
                    </div>
                    {item.href ? (
                      <a href={item.href} className="hover:text-white transition-colors">
                        {item.text}
                      </a>
                    ) : (
                      <span>{item.text}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* BOTTOM BAR */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pt-8 mt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500"
          >
            <p className="text-center md:text-left">
              © {currentYear} <span className="text-violet-400 font-semibold">eTuitionBd</span> Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Privacy', 'Terms', 'Sitemap'].map((item) => (
                <motion.a 
                  key={item}
                  href="#"
                  whileHover={{ scale: 1.05, color: '#a78bfa' }}
                  className="hover:text-violet-400 transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Decorative bottom line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-6 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent"
          />
        </div>
      </footer>
    </>
  );
};

export default Footer;