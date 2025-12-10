import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, MapPin, DollarSign, Clock, BookOpen, 
  Share2, Calendar, User, ShieldCheck, Loader2 
} from "lucide-react";
import { motion } from "framer-motion";

const TuitionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate Data Fetching
  useEffect(() => {
    // In a real app: fetch(`http://localhost:5000/api/tuitions/${id}`)
    setTimeout(() => {
      setJob({
        _id: id,
        subject: "English & Mathematics",
        classGrade: "Class 10 (English Medium)",
        location: "Dhanmondi, Dhaka",
        salary: "8,000",
        days: "4",
        gender: "Any",
        postedAt: new Date(),
        desc: "Need a tutor for an English Medium student. Must be proficient in Edexcel curriculum. Looking for someone from BUET/DU/NSU.",
        studentName: "Rahim K.",
        verified: true
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-violet-500 h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Jobs
        </button>

        {/* Main Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-8 md:p-10 border-b border-white/5 bg-gradient-to-r from-violet-900/20 to-transparent">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-sm font-bold border border-violet-500/30">
                    {job.subject}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-green-400 font-medium bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                    <ShieldCheck size={12} /> Verified Student
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{job.classGrade}</h1>
                <div className="flex items-center gap-2 text-neutral-400">
                  <MapPin size={16} className="text-cyan-400" />
                  {job.location}
                </div>
              </div>

              <div className="text-left md:text-right">
                <div className="text-3xl font-bold text-white mb-1 flex items-center md:justify-end gap-1">
                  <span className="text-2xl text-neutral-500">৳</span> {job.salary}
                </div>
                <p className="text-neutral-400 text-sm">BDT / Month</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Job Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex items-center gap-2 text-neutral-400 text-sm mb-1">
                    <Clock size={16} /> Days/Week
                  </div>
                  <p className="text-lg font-bold text-white">{job.days} Days</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex items-center gap-2 text-neutral-400 text-sm mb-1">
                    <User size={16} /> Gender Pref.
                  </div>
                  <p className="text-lg font-bold text-white">{job.gender}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-300 mb-2">Description</h4>
                <p className="text-neutral-400 leading-relaxed">
                  {job.desc}
                </p>
              </div>
            </div>

            {/* Sidebar / Actions */}
            <div className="flex flex-col gap-4 justify-center md:border-l md:border-white/5 md:pl-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 border border-white/10 text-center">
                <p className="text-neutral-300 mb-6">Interested in this tuition?</p>
                <button className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10 mb-3">
                  Apply Now
                </button>
                <p className="text-xs text-neutral-500">Applying is free for verified tutors.</p>
              </div>
              
              <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-transparent border border-white/10 text-neutral-300 hover:bg-white/5 transition-colors">
                <Share2 size={18} /> Share Job
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TuitionDetails;