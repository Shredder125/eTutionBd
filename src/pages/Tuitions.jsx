import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/AuthContext";
import { MapPin, BookOpen, DollarSign, Search, Loader2, Clock, Send, GraduationCap, Filter } from "lucide-react";
import Swal from "sweetalert2";

// Define Classes for Filter Dropdown
const CLASS_OPTIONS = ["Class 1-5", "Class 6-8", "Class 9-10", "HSC 1st Year", "A Level", "University"];

const Tuitions = () => {
  const { user } = useUserAuth();
  const [tuitions, setTuitions] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // States for Pagination and Filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Current page index (starts at 0)
  const [totalPages, setTotalPages] = useState(0); 
  const [selectedClass, setSelectedClass] = useState(""); // State for class filter
  const limit = 6; // Posts per page

  // State for Modal & Form
  const [selectedTuition, setSelectedTuition] = useState(null);
  const [applyForm, setApplyForm] = useState({
    expectedSalary: "",
    experience: "",
    qualifications: ""
  });

  // 1. Fetch Tuitions & User Role (Includes Pagination & Filters)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Build query string with pagination and filters
        const classQuery = selectedClass ? `&class=${selectedClass}` : "";
        const url = `http://localhost:5000/tuitions?search=${searchTerm}&page=${currentPage}&limit=${limit}${classQuery}`;

        // Fetch Tuitions
        const res = await fetch(url);
        const data = await res.json();
        setTuitions(data.result || []);
        setTotalPages(Math.ceil(data.total / limit)); // Calculate total pages
        
        // Fetch Role (Only if user is logged in)
        if (user?.email) {
            const token = localStorage.getItem("access-token");
            const roleRes = await fetch(`http://localhost:5000/users/${user.email}`, {
                headers: { authorization: `Bearer ${token}` }
            });
            const roleData = await roleRes.json();
            setRole(roleData.role);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchTerm, user, currentPage, selectedClass]); // Dependency array includes pagination/filters

  // Handle Application Submit (Unchanged logic)
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return Swal.fire("Login Required", "Please login first.", "warning");

    const applicationData = {
      tuitionId: selectedTuition._id,
      studentEmail: selectedTuition.studentEmail,
      tutorEmail: user.email,
      tutorName: user.displayName || "Unknown Tutor",
      expectedSalary: applyForm.expectedSalary,
      experience: applyForm.experience,
      qualifications: applyForm.qualifications,
      date: new Date()
    };

    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch("http://localhost:5000/applications", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify(applicationData)
      });
      
      const data = await res.json();

      if (res.status === 400) {
        Swal.fire("Already Applied", "You have already applied to this job.", "info");
      } else if (data.insertedId) {
        Swal.fire("Success!", "Application submitted successfully.", "success");
        setSelectedTuition(null); 
        setApplyForm({ expectedSalary: "", experience: "", qualifications: "" }); 
      } else {
        Swal.fire("Error", "Failed to submit application.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  // Handler for class filter change
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setCurrentPage(0); // Reset page to 0 when filter changes
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">Available Tuitions</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Find the perfect student and start teaching today.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
            {/* Search Input */}
            <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by Subject or Location..." 
                  className="input input-bordered w-full pl-12 rounded-full shadow-sm focus:input-primary"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(0); // Reset page on search
                  }}
                />
            </div>
            {/* Class Filter Dropdown */}
            <div className="relative min-w-[200px]">
                <Filter className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <select 
                    className="select select-bordered w-full pl-10 rounded-full shadow-sm focus:select-primary"
                    value={selectedClass}
                    onChange={handleClassChange}
                >
                    <option value="">Filter by Class</option>
                    {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-primary" />
          </div>
        )}

        {/* Tuitions Grid */}
        {!loading && (
          <>
            {tuitions.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">No approved tuitions found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {tuitions.map((item) => (
                    <div key={item._id} className="card bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                      <div className="card-body">
                        <div className="flex justify-between items-start">
                          <div className="badge badge-primary badge-outline font-semibold">{item.classGrade}</div>
                          <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full">
                              {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h2 className="card-title text-xl text-gray-800 mt-2 group-hover:text-primary transition-colors">
                          {item.subject}
                        </h2>
                        
                        <div className="space-y-3 my-4 text-gray-600 text-sm">
                          <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-primary" /> {item.location}
                          </div>
                          <div className="flex items-center gap-2">
                              <Clock size={16} className="text-primary" /> {item.daysPerWeek} Days / Week
                          </div>
                          <div className="flex items-center gap-2">
                              <DollarSign size={16} className="text-primary" /> 
                              <span className="font-bold text-gray-800">{item.budget} BDT</span> / month
                          </div>
                        </div>

                        <div className="card-actions justify-end mt-4">
                          {/* BUTTON LOGIC: Only Tutors can Apply */}
                          {role === 'tutor' ? (
                              <button 
                                  onClick={() => setSelectedTuition(item)}
                                  className="btn btn-primary w-full text-white shadow-md shadow-primary/20"
                              >
                                  Apply Now
                              </button>
                          ) : (
                              <button disabled className="btn btn-ghost bg-gray-100 text-gray-400 w-full cursor-not-allowed">
                                  {user ? "Login as Tutor to Apply" : "Login to Apply"}
                              </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            )}
            
            {/* --- PAGINATION CONTROLS --- */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                    <div className="join shadow-md">
                        {/* Previous Button */}
                        <button 
                            className="join-item btn btn-ghost"
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            disabled={currentPage === 0}
                        >
                            «
                        </button>
                        
                        {/* Page Numbers (Displaying up to 5 surrounding pages) */}
                        {[...Array(totalPages)].map((_, index) => {
                            // Logic to display only relevant pages
                            if (index < 2 || index >= totalPages - 2 || (index >= currentPage - 1 && index <= currentPage + 1)) {
                                return (
                                    <button 
                                        key={index}
                                        className={`join-item btn ${index === currentPage ? 'btn-active btn-primary text-white' : 'btn-ghost'}`}
                                        onClick={() => setCurrentPage(index)}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            } else if (index === 2 || index === totalPages - 3) {
                                // Add ellipses only once
                                return <button key={index} className="join-item btn btn-ghost" disabled>...</button>;
                            }
                            return null;
                        }).filter((item, index, self) => item !== null && self.findIndex(t => t?.key === item?.key) === index)}

                        {/* Next Button */}
                        <button 
                            className="join-item btn btn-ghost"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={currentPage === totalPages - 1}
                        >
                            »
                        </button>
                    </div>
                </div>
            )}
          </>
        )}
      </div>

      {/* --- APPLICATION MODAL --- */}
      {selectedTuition && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <GraduationCap /> Apply for {selectedTuition.subject}
            </h3>
            <p className="py-2 text-sm text-gray-500">Please provide your details below to apply.</p>
            
            <form onSubmit={handleApplySubmit} className="space-y-4 mt-4">
                <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Your Qualifications</span></label>
                    <input 
                        type="text" 
                        required 
                        placeholder="e.g. B.Sc in Mathematics, BUET"
                        className="input input-bordered focus:input-primary"
                        value={applyForm.qualifications}
                        onChange={e => setApplyForm({...applyForm, qualifications: e.target.value})}
                    />
                </div>

                <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Teaching Experience</span></label>
                    <input 
                        type="text" 
                        required 
                        placeholder="e.g. 3 years of experience"
                        className="input input-bordered focus:input-primary"
                        value={applyForm.experience}
                        onChange={e => setApplyForm({...applyForm, experience: e.target.value})}
                    />
                </div>

                <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Expected Salary (BDT)</span></label>
                    <div className="relative">
                        <span className="absolute left-3 top-3.5 text-gray-400">৳</span>
                        <input 
                            type="number" 
                            required 
                            placeholder="e.g. 5000"
                            className="input input-bordered w-full pl-8 focus:input-primary"
                            value={applyForm.expectedSalary}
                            onChange={e => setApplyForm({...applyForm, expectedSalary: e.target.value})}
                        />
                    </div>
                </div>

                <div className="modal-action">
                    <button 
                        type="button" 
                        className="btn btn-ghost" 
                        onClick={() => setSelectedTuition(null)}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary text-white">
                        <Send size={16} className="mr-2" /> Submit Application
                    </button>
                </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => setSelectedTuition(null)}></div>
        </dialog>
      )}

    </div>
  );
};

export default Tuitions;