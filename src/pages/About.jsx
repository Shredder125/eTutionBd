import React from 'react';
import { ShieldCheck, Users, Zap, DollarSign } from 'lucide-react';

const About = () => {
  const features = [
    { icon: ShieldCheck, title: "Verified Tutors", description: "Every tutor profile is manually reviewed and verified by our admin team before they can apply to jobs." },
    { icon: Users, title: "Role-Based Security", description: "Secure dashboards for students, tutors, and admins ensure targeted access and data integrity." },
    { icon: Zap, title: "Fast Matching", description: "Our platform uses advanced filtering to connect students and tutors efficiently, minimizing wait times." },
    { icon: DollarSign, title: "Secure Payments", description: "Seamless and secure financial transactions powered by Stripe." }
  ];

  return (
    <div className="min-h-screen pt-32 pb-16 bg-base-100">
      <div className="max-w-6xl mx-auto px-4">
        
        <h1 className="text-4xl font-bold text-center text-primary mb-4">About eTuitionBd</h1>
        <p className="text-xl text-center text-base-content/80 max-w-3xl mx-auto mb-12">
          Bridging the gap between reliable tutors and eager students across Bangladesh.
        </p>

        {/* Mission Section */}
        <div className="bg-base-200 p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-3xl font-semibold text-base-content mb-4">Our Mission</h2>
          <p className="text-lg text-base-content/90">
            We are committed to building the most secure and efficient platform for managing tuition. Our goal is to ensure every student finds the right mentor and every qualified tutor finds rewarding work with transparent, structured workflows.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-base-200 hover:border-primary transition-colors">
              <div className="flex items-center gap-4 mb-3">
                <feature.icon size={28} className="text-primary" />
                <h3 className="text-xl font-semibold text-base-content">{feature.title}</h3>
              </div>
              <p className="text-base-content/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;