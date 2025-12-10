import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

/* ANIMATION VARIANTS */
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

/* SHIMMER STYLE */
const styles = `
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

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", form);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="relative min-h-screen pt-32 pb-16 bg-black text-neutral-200 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-1/3 left-1/4 w-96 h-96 bg-violet-600 rounded-full blur-[150px]" />
          <div className="absolute -bottom-1/3 right-1/4 w-96 h-96 bg-fuchsia-600 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h1 
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              className="text-5xl font-black shimmer-text inline-block"
            >
              Get in Touch
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-neutral-400 mt-4 max-w-2xl mx-auto">
              We’re here to help! Send us a message or contact us directly using the details below.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Contact Details */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-violet-400">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="font-medium text-white">Email Support</p>
                  <a href="mailto:support@etuitionindia.com" className="text-violet-400 hover:underline">support@etuitionbd.com</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-violet-400">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="font-medium text-white">Phone/WhatsApp</p>
                  <a href="tel:+919XXXXXXXXX" className="text-violet-400 hover:underline">+91 9XXXXXXXXX</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-violet-400 mt-1">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-medium text-white">Office Location</p>
                  <p className="text-neutral-400">New Delhi, India</p>
                </div>
              </div>
            </motion.div>

            {/* Message Form */}
            <motion.div variants={fadeInUp} className="border-l border-neutral-800 md:pl-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Send a Message</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white placeholder-neutral-500 outline-none focus:border-violet-500 transition"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white placeholder-neutral-500 outline-none focus:border-violet-500 transition"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white placeholder-neutral-500 outline-none focus:border-violet-500 transition"
                />
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl py-3 font-semibold"
                >
                  <Send size={18} /> Submit
                </motion.button>
              </form>
            </motion.div>
          </motion.div>

          {/* Trusted Section */}
          <motion.div variants={fadeInUp} className="mt-16 flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 border border-violet-500/20">
              <Sparkles size={18} className="text-violet-400" />
              <span className="text-neutral-300 font-medium">Trusted by 12,000+ students</span>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;