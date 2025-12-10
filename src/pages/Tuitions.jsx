import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, DollarSign, Search, Loader2, Clock, Send, GraduationCap, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useUserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CLASS_OPTIONS = ["Class 1-5", "Class 6-8", "Class 9-10", "HSC / A-Level", "University"];
const INDIAN_CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Jaipur", "Ahmedabad", "Lucknow"];

const styles = `
  @keyframes shimmer {
    0% { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }
  .shimmer-bg {
    background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
`;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const Tuitions = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  
  const [tuitions, setTuitions] = useState([]);
  const [filteredTuitions, setFilteredTuitions] = useState([]);
  const [isTutor, setIsTutor] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const [selectedTuition, setSelectedTuition] = useState(null);
  const [applyForm, setApplyForm] = useState({
    qualifications: "",
    experience: "",
    expectedSalary: ""
  });
  const [applyLoading, setApplyLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/tuitions`);
        const data = await res.json();

        // Safety check: ensure data is an array before filtering
        const dataArray = Array.isArray(data) ? data : [];
        const approved = dataArray.filter(t => t?.status === 'approved');
        const withIndianLocations = approved.map(t => ({ 
          ...t, 
          location: INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)] 
        }));

        setTuitions(withIndianLocations);
        setFilteredTuitions(withIndianLocations);

        if (user?.email) {
            const token = localStorage.getItem("access-token");
            const roleRes = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.email}`, {
                headers: { authorization: `Bearer ${token}` }
            });
            const roleData = await roleRes.json();
            if (roleData?.role === 'tutor') setIsTutor(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setTuitions([]);
        setFilteredTuitions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    let result = tuitions;
    if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        result = result.filter(item => 
            (item.subject && item.subject.toLowerCase().includes(lowerTerm)) || 
            (item.location && item.location.toLowerCase().includes(lowerTerm))
        );
    }
    if (selectedClass) {
        result = result.filter(item => item.classGrade === selectedClass);
    }
    setFilteredTuitions(result);
    setCurrentPage(0);
  }, [searchTerm, selectedClass, tuitions]);

  const pageCount = Math.ceil(filteredTuitions.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredTuitions.slice(offset, offset + itemsPerPage);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        navigate("/login", { state: { from: "/tuitions" } });
        return;
    }

    const applicationData = {
        tuitionId: selectedTuition._id.toString(),
        tutorEmail: user.email,
        tutorName: user.displayName || "Anonymous Tutor",
        qualifications: applyForm.qualifications,
        experience: applyForm.experience,
        expectedSalary: parseInt(applyForm.expectedSalary),
        status: 'pending',
        appliedAt: new Date()
    };

    setApplyLoading(true);

    try {
        const token = localStorage.getItem("access-token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/applications`, {
            method: "POST",
            headers: { 
                "content-type": "application/json", 
                authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(applicationData)
        });
        const data = await res.json();
        
        if (data.insertedId) {
            Swal.fire({
                icon: 'success',
                title: 'Applied Successfully!',
                text: 'The student will review your application.',
                background: '#1a1a1a',
                color: '#fff'
            });
            setSelectedTuition(null);
            setApplyForm({ qualifications: "", experience: "", expectedSalary: "" });
        } else {
            Swal.fire("Error", data.message || "Failed to apply", "error");
        }
    } catch (error) {
        console.error("Apply error:", error);
        Swal.fire("Error", "Network error occurred", "error");
    } finally {
        setApplyLoading(false);
    }
  };

  const handleApplyClick = (item) => {
      if (!user) {
          navigate("/login", { state: { from: "/tuitions" } });
      } else if (isTutor) {
          setSelectedTuition(item);
      } else {
          Swal.fire({
              icon: 'warning',
              title: 'Student Account',
              text: 'You need a Tutor account to apply for jobs.',
              background: '#1a1a1a',
              color: '#fff'
          });
      }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-black text-neutral-100 py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600 rounded-full blur-[150px]" />
        </div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12 space-y-4">
            <h1 className="text-5xl md:text-6xl font-black text-white">
              Available <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Tuitions</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">Find the perfect student and start teaching today.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
              <input 
                type="text" 
                placeholder="Search by Subject or Location..." 
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-neutral-900/70 border-2 border-neutral-800 text-white placeholder-neutral-500 focus:border-violet-500/50 focus:outline-none transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative min-w-[220px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
              <select 
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-neutral-900/70 border-2 border-neutral-800 text-white focus:border-violet-500/50 focus:outline-none transition-all appearance-none cursor-pointer"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">All Classes</option>
                {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-12 w-12 text-violet-500" /></div>
          ) : (
            <>
              {currentItems.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
                  <p className="text-neutral-400 text-lg">No tuitions found matching your criteria.</p>
                </motion.div>
              ) : (
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {currentItems.map((item) => (
                    <motion.div key={item._id} variants={fadeInUp} whileHover={{ y: -8, scale: 1.02 }} className="relative bg-neutral-900/70 border-2 border-neutral-800 hover:border-violet-500/50 rounded-2xl p-6 transition-all duration-300 group overflow-hidden">
                      <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-bold">{item.classGrade}</span>
                          <span className="text-xs text-neutral-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-violet-400 transition-colors">{item.subject}</h2>
                        <div className="space-y-3 mb-6 text-neutral-400 text-sm">
                          <div className="flex items-center gap-2"><MapPin size={16} className="text-violet-400" /> <span>{item.location}</span></div>
                          <div className="flex items-center gap-2"><Clock size={16} className="text-violet-400" /> <span>{item.daysPerWeek || "Flexible"} Days / Week</span></div>
                          <div className="flex items-center gap-2"><DollarSign size={16} className="text-emerald-400" /> <span className="font-bold text-white">{item.budget} INR</span> <span>/ month</span></div>
                        </div>
                        {isTutor ? (
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleApplyClick(item)} className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-900/20">Apply Now</motion.button>
                        ) : (
                          <button disabled className="w-full py-3 rounded-xl bg-neutral-800 text-neutral-500 font-semibold cursor-not-allowed border border-neutral-700">{user ? "Login as Tutor to Apply" : "Login to Apply"}</button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {pageCount > 1 && (
                <div className="flex justify-center mt-16 gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 disabled:opacity-50"><ChevronLeft size={20} /></button>
                    {[...Array(pageCount)].map((_, i) => (
                        <button key={i} onClick={() => setCurrentPage(i)} className={`w-12 h-12 rounded-xl font-bold transition-all ${currentPage === i ? "bg-violet-600 text-white shadow-lg shadow-violet-200" : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-white"}`}>{i + 1}</button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(pageCount - 1, p + 1))} disabled={currentPage === pageCount - 1} className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 disabled:opacity-50"><ChevronRight size={20} /></button>
                </div>
              )}
            </>
          )}

          {selectedTuition && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl max-w-md w-full p-6 relative shadow-2xl shadow-violet-900/20">
                    <button onClick={() => setSelectedTuition(null)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all"><X size={20} /></button>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30"><GraduationCap className="text-violet-400" size={24} /></div>
                        <div><h3 className="text-xl font-bold text-white">Apply for {selectedTuition.subject}</h3><p className="text-sm text-neutral-400">Provide your details below</p></div>
                    </div>
                    <form onSubmit={handleApplySubmit} className="space-y-4 mt-6">
                        <div>
                            <label className="block text-sm font-semibold text-neutral-300 mb-2">Name</label>
                            <input type="text" value={user?.displayName || "Anonymous Tutor"} readOnly className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-neutral-300 mb-2">Email</label>
                            <input type="text" value={user?.email || ""} readOnly className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-neutral-300 mb-2">Qualifications</label>
                            <input 
                                type="text" 
                                required 
                                placeholder="e.g. B.Sc in Mathematics, Delhi University" 
                                className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-violet-500/50 focus:outline-none transition-all" 
                                value={applyForm.qualifications} 
                                onChange={e => setApplyForm({...applyForm, qualifications: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-neutral-300 mb-2">Experience</label>
                            <input 
                                type="text" 
                                required 
                                placeholder="e.g. 3 years teaching experience" 
                                className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-violet-500/50 focus:outline-none transition-all" 
                                value={applyForm.experience} 
                                onChange={e => setApplyForm({...applyForm, experience: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-neutral-300 mb-2">Expected Salary (INR)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">₹</span>
                                <input 
                                    type="number" 
                                    required 
                                    placeholder={`Around ${selectedTuition.budget} INR`} 
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-violet-500/50 focus:outline-none transition-all" 
                                    value={applyForm.expectedSalary} 
                                    onChange={e => setApplyForm({...applyForm, expectedSalary: e.target.value})} 
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <motion.button 
                                whileHover={{ scale: 1.02 }} 
                                whileTap={{ scale: 0.98 }} 
                                type="button" 
                                className="flex-1 py-3 rounded-xl bg-neutral-800 text-white font-semibold hover:bg-neutral-700 transition-all border border-neutral-700" 
                                onClick={() => setSelectedTuition(null)}
                                disabled={applyLoading}
                            >
                                Cancel
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.02 }} 
                                whileTap={{ scale: 0.98 }} 
                                type="submit"
                                disabled={applyLoading}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {applyLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                {applyLoading ? "Submitting..." : "Submit"}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Tuitions;