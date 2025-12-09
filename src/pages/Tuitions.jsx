import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/AuthContext";
import { MapPin, BookOpen, DollarSign, Search, Loader2, Clock, Send, GraduationCap } from "lucide-react";
import Swal from "sweetalert2";

const Tuitions = () => {
  const { user } = useUserAuth();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState(null); // To store user role (student/tutor/admin)

  // State for Modal & Form
  const [selectedTuition, setSelectedTuition] = useState(null);
  const [applyForm, setApplyForm] = useState({
    expectedSalary: "",
    experience: "",
    qualifications: ""
  });

  // 1. Fetch Tuitions & User Role
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Tuitions
        const res = await fetch(`http://localhost:5000/tuitions?search=${searchTerm}`);
        const data = await res.json();
        setTuitions(data.result || []);

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
  }, [searchTerm, user]);

  // 2. Handle Application Submit
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
        setSelectedTuition(null); // Close Modal
        setApplyForm({ expectedSalary: "", experience: "", qualifications: "" }); // Reset Form
      } else {
        Swal.fire("Error", "Failed to submit application.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">Available Tuitions</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Browse the latest tuition jobs and find your perfect student.</p>
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by Subject or Location..." 
              className="input input-bordered w-full pl-12 rounded-full shadow-sm focus:input-primary"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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

        {!loading && tuitions.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No approved tuitions found matching your search.</p>
            </div>
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