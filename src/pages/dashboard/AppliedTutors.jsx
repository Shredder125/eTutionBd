import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; 
import { Check, X, User, DollarSign, BookOpen, AlertCircle, Briefcase, Loader2 } from "lucide-react";
import Swal from "sweetalert2"; 

const AppliedTutors = () => {
  const { user } = useUserAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!user?.email) return;
        const token = localStorage.getItem("access-token");
        if (!token) return;

        const res = await fetch(`${import.meta.env.VITE_API_URL}/applications/received/${user.email}`, {
          headers: { authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setApplications([]);
          return;
        }

        const data = await res.json();
        setApplications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [user]);

  const handleReject = async (id) => {
    Swal.fire({
      title: "Reject Tutor?",
      text: "You cannot undo this action.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Reject"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("access-token");
          const res = await fetch(`${import.meta.env.VITE_API_URL}/applications/reject/${id}`, {
            method: "PATCH",
            headers: { authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.modifiedCount > 0) {
            setApplications(prev => prev.map(app => 
              app._id === id ? { ...app, status: 'rejected' } : app
            ));
            Swal.fire("Rejected", "Application has been rejected.", "success");
          }
        } catch (error) {
          console.error("Error rejecting:", error);
        }
      }
    });
  };

  const handleApprove = (app) => {
    Swal.fire({
      title: "Hire this Tutor?",
      text: `To hire ${app.tutorName}, you need to pay the first month's salary of ₹${app.expectedSalary}.`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Proceed to Payment",
      confirmButtonColor: "#10b981"
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/dashboard/payment", { state: { application: app } });
      }
    });
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin text-primary h-10 w-10 mx-auto"/></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
           <User className="text-primary" /> Tutor Applications
        </h1>
        <p className="text-gray-500 text-sm mt-1">Review tutors who applied to your posts.</p>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
           <div className="bg-gray-50 p-4 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
           </div>
           <p className="text-gray-500 font-medium">No tutors have applied to your posts yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div key={app._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
              
              <div className={`absolute top-0 left-0 w-1 h-full 
                ${app.status === 'approved' ? 'bg-green-500' : app.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}>
              </div>

              <div className="pl-2">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">{app.tutorName}</h3>
                        <p className="text-xs text-gray-500">{app.tutorEmail}</p>
                    </div>
                    <span className={`badge border-0 font-bold py-3 ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                        app.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        'bg-red-100 text-red-700'
                    }`}>
                        {app.status.toUpperCase()}
                    </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl space-y-3 mb-4 border border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <BookOpen size={16} className="text-primary" /> 
                        <span>Applied for: <span className="font-bold">{app.tuitionData?.subject || "Unknown Post"}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Briefcase size={16} className="text-primary" /> 
                        <span>Experience: <span className="font-bold">{app.experience}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <BookOpen size={16} className="text-primary" /> 
                        <span>Qualification: <span className="font-bold">{app.qualifications}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <DollarSign size={16} className="text-green-600" /> 
                        <span>Expected Salary: <span className="font-bold text-green-700">₹ {app.expectedSalary}</span></span>
                    </div>
                </div>
              </div>

              {app.status === 'pending' && (
                  <div className="flex gap-3 mt-2 pl-2">
                    <button 
                        onClick={() => handleReject(app._id)}
                        className="btn btn-outline btn-error btn-sm flex-1 gap-2 hover:text-white"
                    >
                        <X size={16} /> Reject
                    </button>
                    <button 
                        onClick={() => handleApprove(app)}
                        className="btn btn-primary btn-sm flex-1 text-white gap-2 shadow-md shadow-primary/20"
                    >
                        <Check size={16} /> Accept & Pay
                    </button>
                  </div>
              )}
              
              {app.status === 'rejected' && (
                  <p className="text-center text-red-500 text-sm font-medium mt-2 bg-red-50 py-2 rounded-lg">Application Rejected</p>
              )}
              {app.status === 'approved' && (
                  <p className="text-center text-green-600 text-sm font-bold mt-2 bg-green-50 py-2 rounded-lg flex items-center justify-center gap-2">
                      <Check size={16}/> Hired Successfully
                  </p>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedTutors;
