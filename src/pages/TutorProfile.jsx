import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    MapPin, Mail, Phone, Star, ShieldCheck, Clock, BookOpen, 
    GraduationCap, Briefcase, Award, CheckCircle2, MessageCircle, ArrowLeft, Share2
} from "lucide-react";
import { motion } from "framer-motion";
import Loader2 from "lucide-react/dist/esm/icons/loader-2";

const TutorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutorDetails = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/tutors/${id}`);
                const data = await res.json();
                setTutor(data);
            } catch (error) {
                console.error("Error fetching tutor:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTutorDetails();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <Loader2 className="animate-spin text-violet-500 h-10 w-10" />
        </div>
    );

    if (!tutor) return <div className="text-white text-center pt-20">Tutor not found</div>;

    const { 
        name, role, experience, studentEnrollments, tuitionSchedule, 
        email, phone, subject, rating = 4.9, bio, education, location, hourlyRate 
    } = tutor;

    const imageUrl = tutor.profileImage || tutor.photoURL || "https://placehold.co/400";

    return (
        <div className="min-h-screen bg-[#050505] text-neutral-200 font-sans pb-20">
            <div className="relative h-[350px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-violet-900/30 via-[#050505]/80 to-[#050505] z-10" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-10" />
                <div className="absolute top-[-50%] left-[20%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-fuchsia-600/20 rounded-full blur-[120px]" />
                
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-24 left-6 z-50 p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={20} className="text-white" />
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-20 -mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 relative overflow-hidden mb-8"
                        >
                            <div className="absolute top-0 right-0 p-32 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
                            
                            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                                <div className="relative shrink-0">
                                    <div className="w-40 h-40 rounded-full p-1.5 bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-2xl">
                                        <img src={imageUrl} alt={name} className="w-full h-full rounded-full object-cover border-4 border-[#0a0a0a]" />
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-green-500 text-[#0a0a0a] p-1.5 rounded-full border-4 border-[#0a0a0a]">
                                        <ShieldCheck size={20} strokeWidth={3} />
                                    </div>
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                                        <h1 className="text-4xl font-black text-white tracking-tight">{name}</h1>
                                        <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wider">
                                            {role || "Expert Tutor"}
                                        </span>
                                    </div>
                                    
                                    <p className="text-lg text-neutral-400 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
                                        <Briefcase size={18} className="text-fuchsia-500" /> 
                                        {subject || "General Science"} Specialist
                                    </p>

                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-neutral-500">
                                        <span className="flex items-center gap-1.5"><MapPin size={14} /> {location || "Mumbai, India"}</span>
                                        <span className="flex items-center gap-1.5"><Clock size={14} /> Member since 2023</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
                                <div className="text-center md:text-left">
                                    <p className="text-2xl font-bold text-white">{studentEnrollments}+</p>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Students</p>
                                </div>
                                <div className="text-center md:text-left border-l border-white/5 pl-4">
                                    <p className="text-2xl font-bold text-white">{experience} Years</p>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Experience</p>
                                </div>
                                <div className="text-center md:text-left border-l border-white/5 pl-4">
                                    <div className="flex items-center justify-center md:justify-start gap-1">
                                        <span className="text-2xl font-bold text-white">{rating}</span>
                                        <Star size={16} className="fill-yellow-500 text-yellow-500" />
                                    </div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Rating</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="space-y-8">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8"
                            >
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <UserIcon /> About Me
                                </h3>
                                <p className="text-neutral-400 leading-relaxed">
                                    {bio || "I am a passionate educator with a strong background in teaching. I focus on conceptual clarity and adapt my teaching style to suit each student's needs. My goal is to make learning enjoyable and effective."}
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8"
                                >
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <GraduationCap className="text-violet-500" /> Education
                                    </h3>
                                    <ul className="space-y-4">
                                        {(education || ["B.Sc in Computer Science, IIT Bombay", "HSC, St. Xavier's College, Mumbai"]).map((edu, i) => (
                                            <li key={i} className="flex gap-3">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                                                <span className="text-neutral-300">{edu}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8"
                                >
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Clock className="text-fuchsia-500" /> Availability
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(tuitionSchedule || []).map((slot, i) => (
                                            <div key={i} className="bg-neutral-900 border border-white/5 rounded-xl px-4 py-2 text-sm text-neutral-300">
                                                <span className="font-bold text-white block">{slot.day}</span>
                                                <span className="text-xs text-neutral-500">{slot.startTime} - {slot.endTime}</span>
                                            </div>
                                        ))}
                                        {(!tuitionSchedule || tuitionSchedule.length === 0) && (
                                            <p className="text-neutral-500 italic">Contact for schedule.</p>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl"
                            >
                                <div className="flex justify-between items-end mb-6 pb-6 border-b border-white/10">
                                    <div>
                                        <p className="text-neutral-400 text-sm">Starting from</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-white">₹ {hourlyRate || "5000"}</span>
                                            <span className="text-neutral-500">/mo</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-1 rounded-lg text-xs font-bold border border-green-500/20">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Available
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-violet-200 transition-colors shadow-lg shadow-violet-500/10 flex items-center justify-center gap-2">
                                        Book Now <ArrowLeft className="rotate-180" size={20} />
                                    </button>
                                    <button className="w-full py-3 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors border border-white/10 flex items-center justify-center gap-2">
                                        <MessageCircle size={18} /> Chat with Tutor
                                    </button>
                                </div>

                                <div className="mt-6 text-xs text-neutral-500 text-center flex flex-col gap-2">
                                    <p className="flex items-center justify-center gap-1.5">
                                        <ShieldCheck size={14} /> Verified by eTuitionBd
                                    </p>
                                    <p>100% Secure Payment</p>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6"
                            >
                                <h4 className="text-white font-bold mb-4">Contact Info</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl border border-white/5">
                                        <Mail size={18} className="text-violet-400" />
                                        <span className="text-sm text-neutral-300 truncate">{email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl border border-white/5">
                                        <Phone size={18} className="text-fuchsia-400" />
                                        <span className="text-sm text-neutral-300">{phone || "Hidden"}</span>
                                    </div>
                                    <button className="w-full flex items-center justify-center gap-2 text-neutral-400 hover:text-white text-sm mt-2 transition-colors">
                                        <Share2 size={14} /> Share Profile
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default TutorProfile;
