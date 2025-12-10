import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, BookOpen, DollarSign, Search, Loader2, Clock, Send, GraduationCap, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";

// Mock Auth Context (replace with your actual context)
const useUserAuth = () => ({ user: null });

// Define Classes for Filter Dropdown
const CLASS_OPTIONS = ["Class 1-5", "Class 6-8", "Class 9-10", "HSC 1st Year", "A Level", "University"];

/* STYLES */
const styles = `
  @keyframes shimmer {
    0% { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
    50% { box-shadow: 0 0 30px rgba(236, 72, 153, 0.5); }
  }
  .shimmer-bg {
    background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
`;

/* ANIMATION VARIANTS */
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
  const [tuitions, setTuitions] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // States for Pagination and Filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0); 
  const [selectedClass, setSelectedClass] = useState("");
  const limit = 6;

  // State for Modal & Form
  const [selectedTuition, setSelectedTuition] = useState(null);
  const [applyForm, setApplyForm] = useState({
    expectedSalary: "",
    experience: "",
    qualifications: ""
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockTuitions = [
      { _id: 1, subject: "Mathematics", classGrade: "Class 10", location: "Dhanmondi, Dhaka", daysPerWeek: "4", budget: "8000", createdAt: new Date(), studentEmail: "student@example.com" },
      { _id: 2, subject: "Physics", classGrade: "HSC 1st Year", location: "Gulshan, Dhaka", daysPerWeek: "3", budget: "10000", createdAt: new Date(), studentEmail: "student2@example.com" },
      { _id: 3, subject: "English", classGrade: "Class 8", location: "Uttara, Dhaka", daysPerWeek: "5", budget: "6000", createdAt: new Date(), studentEmail: "student3@example.com" },
      { _id: 4, subject: "Chemistry", classGrade: "A Level", location: "Banani, Dhaka", daysPerWeek: "4", budget: "12000", createdAt: new Date(), studentEmail: "student4@example.com" },
      { _id: 5, subject: "Biology", classGrade: "Class 9-10", location: "Mirpur, Dhaka", daysPerWeek: "3", budget: "7000", createdAt: new Date(), studentEmail: "student5@example.com" },
      { _id: 6, subject: "Bengali", classGrade: "Class 1-5", location: "Mohammadpur, Dhaka", daysPerWeek: "2", budget: "5000", createdAt: new Date(), studentEmail: "student6@example.com" },
    ];
    
    setTimeout(() => {
      setTuitions(mockTuitions);
      setTotalPages(2);
      setRole('tutor');
      setLoading(false);
    }, 1000);
  }, [searchTerm, currentPage, selectedClass]);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    alert("Application submitted successfully!");
    setSelectedTuition(null);
    setApplyForm({ expectedSalary: "", experience: "", qualifications: "" });
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setCurrentPage(0);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-black text-neutral-100 py-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600 rounded-full blur-[150px]" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 space-y-4"
          >
            <h1 className="text-5xl md:text-6xl font-black text-white">
              Available <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Tuitions</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Find the perfect student and start teaching today.
            </p>
          </motion.div>

          {/* Search & Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto"
          >
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
              <input 
                type="text" 
                placeholder="Search by Subject or Location..." 
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-neutral-900/70 border-2 border-neutral-800 text-white placeholder-neutral-500 focus:border-violet-500/50 focus:outline-none transition-all"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
              />
            </div>

            {/* Class Filter Dropdown */}
            <div className="relative min-w-[220px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
              <select 
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-neutral-900/70 border-2 border-neutral-800 text-white focus:border-violet-500/50 focus:outline-none transition-all appearance-none cursor-pointer"
                value={selectedClass}
                onChange={handleClassChange}
              >
                <option value="">All Classes</option>
                {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin h-12 w-12 text-violet-500" />
            </div>
          )}

          {/* Tuitions Grid */}
          {!loading && (
            <>
              {tuitions.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 bg-neutral-900/50 border border-neutral-800 rounded-2xl"
                >
                  <p className="text-neutral-400 text-lg">No tuitions found matching your criteria.</p>
                </motion.div>
              ) : (
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {tuitions.map((item) => (
                    <motion.div 
                      key={item._id}
                      variants={fadeInUp}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="relative bg-neutral-900/70 border-2 border-neutral-800 hover:border-violet-500/50 rounded-2xl p-6 transition-all duration-300 group overflow-hidden"
                    >
                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-bold">
                            {item.classGrade}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-violet-400 transition-colors">
                          {item.subject}
                        </h2>
                        
                        <div className="space-y-3 mb-6 text-neutral-400 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-violet-400" />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-violet-400" />
                            <span>{item.daysPerWeek} Days / Week</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign size={16} className="text-emerald-400" />
                            <span className="font-bold text-white">{item.budget} BDT</span>
                            <span>/ month</span>
                          </div>
                        </div>

                        {/* Button */}
                        {role === 'tutor' ? (
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedTuition(item)}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all"
                          >
                            Apply Now
                          </motion.button>
                        ) : (
                          <button 
                            disabled 
                            className="w-full py-3 rounded-xl bg-neutral-800 text-neutral-500 font-semibold cursor-not-allowed"
                          >
                            {user ? "Login as Tutor to Apply" : "Login to Apply"}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-center mt-12"
                >
                  <div className="flex items-center gap-2 bg-neutral-900/70 border border-neutral-800 rounded-xl p-2">
                    {/* Previous Button */}
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft size={20} />
                    </motion.button>
                    
                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, index) => (
                      <motion.button 
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          index === currentPage 
                            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' 
                            : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                        }`}
                        onClick={() => setCurrentPage(index)}
                      >
                        {index + 1}
                      </motion.button>
                    ))}

                    {/* Next Button */}
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={currentPage === totalPages - 1}
                    >
                      <ChevronRight size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Application Modal */}
        {selectedTuition && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl max-w-md w-full p-6 relative"
            >
              {/* Close button */}
              <button 
                onClick={() => setSelectedTuition(null)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30">
                  <GraduationCap className="text-violet-400" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Apply for {selectedTuition.subject}</h3>
                  <p className="text-sm text-neutral-400">Provide your details below</p>
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">
                    Your Qualifications
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. B.Sc in Mathematics, BUET"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-violet-500/50 focus:outline-none transition-all"
                    value={applyForm.qualifications}
                    onChange={e => setApplyForm({...applyForm, qualifications: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">
                    Teaching Experience
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. 3 years of experience"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-violet-500/50 focus:outline-none transition-all"
                    value={applyForm.experience}
                    onChange={e => setApplyForm({...applyForm, experience: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">
                    Expected Salary (BDT)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">৳</span>
                    <input 
                      type="number" 
                      required 
                      placeholder="e.g. 5000"
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
                    className="flex-1 py-3 rounded-xl bg-neutral-800 text-white font-semibold hover:bg-neutral-700 transition-all" 
                    onClick={() => setSelectedTuition(null)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApplySubmit}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    Submit
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tuitions;