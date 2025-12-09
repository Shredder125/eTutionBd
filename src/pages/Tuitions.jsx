import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/AuthContext";
import { MapPin, BookOpen, DollarSign, Calendar, Search, Filter, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

const Tuitions = () => {
  const { user } = useUserAuth();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Approved Tuitions
  useEffect(() => {
    const fetchTuitions = async () => {
      try {
        // Only fetches status='approved' from backend
        const res = await fetch(`http://localhost:5000/tuitions?search=${searchTerm}`);
        const data = await res.json();
        // The backend returns { result: [], total: ... }
        setTuitions(data.result || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTuitions();
  }, [searchTerm]);

  // Handle Apply
  const handleApply = async (tuition) => {
    if (!user) {
      return Swal.fire("Login Required", "Please login as a Tutor to apply.", "warning");
    }

    // Ask for Expected Salary
    const { value: salary } = await Swal.fire({
      title: 'Apply for Tuition',
      text: `Subject: ${tuition.subject}`,
      input: 'number',
      inputLabel: 'Your Expected Salary (BDT)',
      inputPlaceholder: 'e.g. 5000',
      showCancelButton: true,
      confirmButtonText: 'Submit Application',
      inputValidator: (value) => {
        if (!value) return 'You need to write your expected salary!';
      }
    });

    if (salary) {
      try {
        const token = localStorage.getItem("access-token");
        const applicationData = {
          tuitionId: tuition._id,
          tutorEmail: user.email,
          tutorName: user.displayName || "Unknown Tutor",
          expectedSalary: parseInt(salary),
        };

        const res = await fetch("http://localhost:5000/applications", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`
          },
          body: JSON.stringify(applicationData)
        });

        const result = await res.json();

        if (result.insertedId) {
          Swal.fire("Success!", "Application sent successfully.", "success");
        } else {
          Swal.fire("Error", result.message || "Failed to apply.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-20 px-4">
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
              className="input input-bordered w-full pl-12 rounded-full focus:input-primary"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center">
            <Loader2 className="animate-spin h-10 w-10 text-primary" />
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((item) => (
              <div key={item._id} className="card bg-white border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div className="badge badge-primary badge-outline">{item.classGrade}</div>
                    <span className="text-xs text-gray-400 font-medium">
                        {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h2 className="card-title text-2xl text-gray-800 mt-2">{item.subject}</h2>
                  
                  <div className="space-y-3 my-4 text-gray-600">
                    <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-primary" /> {item.location}
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign size={18} className="text-primary" /> 
                        <span className="font-bold">{item.budget} BDT</span> / month
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>

                  <div className="card-actions justify-end mt-4">
                    <button 
                        onClick={() => handleApply(item)}
                        className="btn btn-primary w-full text-white"
                    >
                        Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && tuitions.length === 0 && (
            <div className="text-center py-10">
                <p className="text-gray-500 text-lg">No approved tuitions found.</p>
                <p className="text-sm text-gray-400">Post a tuition via Dashboard to see it here (after approval).</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Tuitions;