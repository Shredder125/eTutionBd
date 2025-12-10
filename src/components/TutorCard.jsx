import React, { useState } from 'react';
import { 
    Clock, Users, Briefcase, Mail, Phone, Sparkles, 
    Send, Loader2, Star, ShieldCheck, MapPin, BookOpen, GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';

const TutorCard = ({ tutor }) => {
    const { 
        name, 
        role = 'Expert Tutor', 
        experience, 
        studentEnrollments, 
        tuitionSchedule, 
        email, 
        phone,
        subject = "General Science", 
        rating = 4.9 
    } = tutor || {};

    const imageUrl = 
        tutor?.profileImage || 
        tutor?.photoURL || 
        tutor?.image || 
        tutor?.avatar || 
        tutor?.url;

    const [imageError, setImageError] = useState(false);

    const initials = name
        ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        : "T?";

    if (!tutor) {
        return (
            <div className="h-[600px] w-full bg-[#0a0a0a] border border-white/5 rounded-[24px] flex items-center justify-center">
                <Loader2 className="animate-spin text-violet-500" size={32} />
            </div>
        );
    }

    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className="group relative w-full h-[600px] bg-[#0a0a0a] rounded-[24px] border border-white/10 overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_0_50px_-10px_rgba(124,58,237,0.3)] hover:border-violet-500/50"
        >
            {/* HEADER */}
            <div className="relative h-40 bg-[#111] overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-900/40 via-fuchsia-900/20 to-black opacity-80" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                
                <div className="absolute top-4 right-4 z-20">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-violet-300 uppercase tracking-widest shadow-xl">
                        <Sparkles size={10} className="fill-violet-300" /> {role}
                    </span>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col items-center relative z-10 -mt-20 px-6 min-h-[280px]">

                {/* AVATAR */}
                <div className="relative group-hover:scale-105 transition-transform duration-500 ease-out shrink-0">
                    <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-b from-violet-500 to-black shadow-2xl relative z-10 ring-8 ring-[#0a0a0a] group-hover:ring-violet-500/30 transition-all duration-500">
                        <div className="w-full h-full rounded-full overflow-hidden bg-[#1a1a1a] relative">
                            {imageUrl && !imageError ? (
                                <img 
                                    src={imageUrl} 
                                    alt={name} 
                                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700" 
                                    onError={() => setImageError(true)} 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white bg-neutral-800">
                                    {initials}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="absolute bottom-1 right-1 z-20 bg-green-500 text-black p-1.5 rounded-full border-4 border-[#0a0a0a]">
                        <ShieldCheck size={16} strokeWidth={3} />
                    </div>
                </div>

                {/* NAME + SUBJECT */}
                <div className="text-center mt-5 w-full shrink-0">
                    <h3 className="text-2xl font-bold text-white truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-violet-400 transition-all duration-300">
                        {name}
                    </h3>
                    
                    <div className="mt-2 mb-3 flex justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:border-violet-500/30 transition-colors">
                            <BookOpen size={14} className="text-fuchsia-400" />
                            <span className="text-sm font-medium text-neutral-200 truncate max-w-[200px]">{subject}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500">
                        <div className="flex text-yellow-400"><Star size={12} fill="currentColor"/></div>
                        <span className="font-bold text-white">{rating}</span>
                        <span>•</span>
                        <span>{studentEnrollments} Students</span>
                    </div>
                </div>

                {/* STATS */}
                <div className="w-full mt-4 grid grid-cols-2 gap-3 shrink-0">
                    <div className="bg-[#151515] p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center hover:bg-[#1a1a1a] transition-colors group/stat">
                        <Briefcase size={16} className="text-neutral-500 group-hover/stat:text-violet-400 transition-colors mb-1" />
                        <span className="text-base font-bold text-white">{experience} Yrs</span>
                        <span className="text-[10px] text-neutral-600 uppercase tracking-wider font-bold">Experience</span>
                    </div>
                    <div className="bg-[#151515] p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center hover:bg-[#1a1a1a] transition-colors group/stat">
                        <GraduationCap size={16} className="text-neutral-500 group-hover/stat:text-fuchsia-400 transition-colors mb-1" />
                        <span className="text-base font-bold text-white">Online</span>
                        <span className="text-[10px] text-neutral-600 uppercase tracking-wider font-bold">Mode</span>
                    </div>
                </div>

                {/* INFO ROW */}
                <div className="w-full flex items-center justify-between text-xs text-neutral-500 mt-4 px-1">
                    <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-neutral-400" /> 
                        <span className="truncate max-w-[100px]">New Delhi, IN</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Mail size={12} className="text-neutral-400" /> 
                        <span className="truncate max-w-[120px]">{email}</span>
                    </div>
                </div>
            </div>

            {/* FOOTER BUTTON */}
            <div className="p-6 pt-4 mt-auto">
                <button className="relative w-full py-4 rounded-xl bg-white text-black font-bold text-sm overflow-hidden group/btn shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-200 via-white to-fuchsia-200 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        View Profile <Send size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                </button>
            </div>
        </motion.div>
    );
};

export default TutorCard;
