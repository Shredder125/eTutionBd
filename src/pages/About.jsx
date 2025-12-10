import React, { useEffect } from "react";
import { ShieldCheck, Users, Zap, IndianRupee, Sparkles } from "lucide-react";
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

/* STYLES */
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

const features = [
  { 
    icon: ShieldCheck, 
    title: "Verified Tutors", 
    description: "Every tutor profile is manually reviewed and verified by our admin team before they can apply to jobs." 
  },
  { 
    icon: Users, 
    title: "Role-Based Security", 
    description: "Secure dashboards for students, tutors, and admins ensure targeted access and data integrity." 
  },
  { 
    icon: Zap, 
    title: "Fast Matching", 
    description: "Our platform uses advanced filtering to connect students and tutors efficiently, minimizing wait times." 
  },
  { 
    icon: IndianRupee, 
    title: "Secure Payments", 
    description: "Seamless and secure financial transactions powered by Razorpay and UPI." 
  }
];

const About = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="relative min-h-screen pt-32 pb-16 bg-black text-neutral-200 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-1/3 left-1/4 w-96 h-96 bg-violet-600 rounded-full blur-[150px]" />
          <div className="absolute -bottom-1/3 right-1/4 w-96 h-96 bg-fuchsia-600 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 z-10">
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
              className="text-5xl md:text-6xl font-black shimmer-text inline-block"
            >
              About eTuitionBD
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-neutral-400 mt-4 max-w-3xl mx-auto">
              Bridging the gap between reliable tutors and eager students across India.
            </motion.p>
          </motion.div>

          {/* Mission Section */}
          <motion.div variants={fadeInUp} className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 shadow-lg mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-white">Our Mission</h2>
            <p className="text-neutral-300 text-lg">
              We are committed to building the most secure and efficient platform for managing tuition. Our goal is to ensure every student finds the right mentor and every qualified tutor finds rewarding work with transparent, structured workflows.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className="bg-neutral-900 p-6 rounded-xl shadow-md border border-neutral-800 hover:border-violet-500 transition-all"
              >
                <div className="flex items-center gap-4 mb-3">
                  <feature.icon size={28} className="text-violet-400" />
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-neutral-400">{feature.description}</p>
              </motion.div>
            ))}
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

export default About;