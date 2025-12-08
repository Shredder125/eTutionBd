import React from "react";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone, 
  ChevronRight 
} from "lucide-react";

/* --- CUSTOM ICONS --- */
// The official X (formerly Twitter) logo as a component compatible with Lucide props
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

/* --- DATA CONSTANTS --- */
const SOCIAL_LINKS = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: XIcon, href: "#", label: "X (Twitter)" }, /* NEW X LOGO ADDED HERE */
  { icon: Linkedin, href: "#", label: "LinkedIn" },
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

/* --- SUB-COMPONENTS --- */

// *** FIXED COMPONENT ***
const SocialButton = ({ icon: Icon, href, label }) => (
  <a
    href={href}
    aria-label={label}
    className="p-3 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
  >
    <Icon size={20} aria-hidden="true" />
  </a>
);

const FooterColumn = ({ title, links }) => (
  <div>
    <h3 className="text-lg font-semibold mb-6 text-white tracking-wide">{title}</h3>
    <ul className="space-y-3">
      {links.map((link, i) => (
        <li key={i}>
          <a
            href={link.href}
            className="group flex items-center gap-2 text-neutral-400 hover:text-purple-400 transition-colors duration-200 focus:outline-none focus:text-purple-400"
          >
            <ChevronRight
              size={16}
              className="text-neutral-600 group-hover:text-purple-500 transition-colors"
            />
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

/* --- MAIN COMPONENT --- */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-neutral-950 text-neutral-200 pt-24 pb-10 px-6 overflow-hidden border-t border-neutral-900">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* BRAND COLUMN */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                eTuitionBd
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                Empowering education with reliable tuition services. Learn, teach, and grow with the industry leaders since 2025.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social, idx) => (
                <SocialButton key={idx} {...social} />
              ))}
            </div>
          </div>

          {/* DYNAMIC LINK COLUMNS */}
          {FOOTER_SECTIONS.map((section, idx) => (
            <FooterColumn key={idx} title={section.title} links={section.links} />
          ))}

          {/* NEWSLETTER & CONTACT */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Stay Updated</h3>
              <p className="text-neutral-400 text-sm mb-4">
                Subscribe for the latest tutor jobs and updates.
              </p>
              
              <form className="group relative flex rounded-xl bg-neutral-900/50 border border-neutral-800 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all overflow-hidden">
                <label htmlFor="email-subscribe" className="sr-only">Email address</label>
                <input
                  id="email-subscribe"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent py-3 px-4 text-sm text-white placeholder-neutral-500 outline-none"
                  required
                />
                <button 
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="bg-neutral-800 hover:bg-neutral-700 text-white px-5 transition-colors border-l border-neutral-800"
                >
                  <Mail size={18} />
                </button>
              </form>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 pt-2">
              {CONTACT_INFO.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-neutral-400 text-sm group">
                  <div className="p-2 rounded-full bg-neutral-900 text-purple-500 group-hover:bg-purple-500/10 transition-colors">
                    <item.icon size={14} />
                  </div>
                  {item.href ? (
                    <a href={item.href} className="hover:text-white transition-colors">
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 mt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>© {currentYear} eTuitionBd Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;